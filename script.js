/*jslint browser */

// moXx: an overly demanding personal journal.
// Every convenience is a privilege you have not earned.

const MINIMUM_WORDS = 50;

const ACCESS_DENIED = (
    "Access Denied. You know where the HTML file is. Go write some code."
);
const REJECTED = (
    "Entry rejected at runtime: Insufficient reflection. Try harder."
);

const BLOCKED_KEYS = ["c", "v", "x"];
const BLOCKED_EVENTS = ["copy", "cut", "paste"];

// 1. The mocking "New Entry" button.

document.getElementById("new-entry").addEventListener("click", function () {
    window.alert(ACCESS_DENIED);
});

// 3. Anti-plagiarism. Your past thoughts stay where you left them.

function refuse(event) {
    event.preventDefault();
}

BLOCKED_EVENTS.forEach(function (type) {
    document.addEventListener(type, refuse);
});

document.addEventListener("keydown", function (event) {
    const key = String(event.key).toLowerCase();

    if (
        (event.ctrlKey || event.metaKey)
        && BLOCKED_KEYS.includes(key)
    ) {
        event.preventDefault();
    }
});

// 2. Word count enforcer. Fewer than 50 words is not reflection.

function countWords(text) {
    return text.trim().split(/\s+/).filter(Boolean).length;
}

window.addEventListener("load", function () {
    const entries = document.querySelectorAll(".entry");
    const counter = document.getElementById("entry-count");

    document.querySelectorAll(".entry p").forEach(function (paragraph) {
        if (countWords(paragraph.textContent) < MINIMUM_WORDS) {
            paragraph.textContent = REJECTED;
            paragraph.classList.add("rejected");
        }
    });

    counter.textContent = entries.length + " entries";
});
