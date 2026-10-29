const ACCESS_DENIED =
    "Access Denied. You know where the HTML file is. Go write some code.";
const REJECTED =
    "Entry rejected at runtime: Insufficient reflection. Try harder.";

function createParagraph(text) {
    return {
        textContent: text,
        classList: {
            add: jest.fn()
        }
    };
}

function createEnvironment(paragraphs) {
    const documentListeners = {};
    const windowListeners = {};
    const newEntry = { addEventListener: jest.fn((type, callback) => {
        newEntry.click = callback;
    }) };
    const counter = { textContent: "" };
    const entries = paragraphs.map(() => ({}));

    global.document = {
        getElementById: jest.fn((id) => {
            if (id === "new-entry") {
                return newEntry;
            }
            if (id === "entry-count") {
                return counter;
            }
            return null;
        }),
        addEventListener: jest.fn((type, callback) => {
            documentListeners[type] = callback;
        }),
        querySelectorAll: jest.fn((selector) => {
            if (selector === ".entry") {
                return entries;
            }
            if (selector === ".entry p") {
                return paragraphs;
            }
            return [];
        })
    };

    global.window = {
        alert: jest.fn(),
        addEventListener: jest.fn((type, callback) => {
            windowListeners[type] = callback;
        })
    };

    return { counter, documentListeners, newEntry, windowListeners };
}

describe("script.js", () => {
    let environment;

    beforeEach(() => {
        jest.resetModules();
        environment = createEnvironment([]);
        require("./script.js");
    });

    test("the New Entry button displays the access-denied message", () => {
        environment.newEntry.click();

        expect(window.alert).toHaveBeenCalledWith(ACCESS_DENIED);
    });

    test.each(["copy", "cut", "paste"])(
        "prevents the %s clipboard event",
        (type) => {
            const event = { preventDefault: jest.fn() };

            environment.documentListeners[type](event);

            expect(event.preventDefault).toHaveBeenCalledTimes(1);
        }
    );

    test.each([
        ["c", "ctrlKey"],
        ["v", "ctrlKey"],
        ["x", "ctrlKey"],
        ["c", "metaKey"],
        ["v", "metaKey"],
        ["x", "metaKey"]
    ])("blocks %s with %s", (key, modifier) => {
        const event = {
            key,
            ctrlKey: modifier === "ctrlKey",
            metaKey: modifier === "metaKey",
            preventDefault: jest.fn()
        };

        environment.documentListeners.keydown(event);

        expect(event.preventDefault).toHaveBeenCalledTimes(1);
    });

    test("does not block ordinary typing", () => {
        const event = {
            key: "a",
            ctrlKey: false,
            metaKey: false,
            preventDefault: jest.fn()
        };

        environment.documentListeners.keydown(event);

        expect(event.preventDefault).not.toHaveBeenCalled();
    });

    test("prevents dragging selected text out of an entry", () => {
        const event = { preventDefault: jest.fn() };

        environment.documentListeners.dragstart(event);

        expect(event.preventDefault).toHaveBeenCalledTimes(1);
    });

    test("rejects entries with fewer than 50 words and reports the entry count", () => {
        const shortEntry = createParagraph(Array(49).fill("word").join(" "));
        const validEntry = createParagraph(Array(50).fill("word").join(" "));
        environment = createEnvironment([shortEntry, validEntry]);
        jest.resetModules();
        require("./script.js");

        environment.windowListeners.load();

        expect(shortEntry.textContent).toBe(REJECTED);
        expect(shortEntry.classList.add).toHaveBeenCalledWith("rejected");
        expect(validEntry.textContent).toBe(Array(50).fill("word").join(" "));
        expect(validEntry.classList.add).not.toHaveBeenCalled();
        expect(environment.counter.textContent).toBe("2 entries");
    });
});