export class MockDB {
    #db;
    #counter;
    #name;
    constructor(name, db = []) {
        this.#db = db;
        this.#name = name;
        this.#counter = Date.now();
    }

    insertOne(doc) {
        doc['_id'] = this.#counter++;
        this.#db.push(doc);
    }

    find(filters = {}) {
        const filterKeys = Object.keys(filters);
        if (!filterKeys.length) {
            return this.#db;
        }
    }

    #coreFind(filters = {}) {
        let foundDoc = {};
        let foundIndex = -1;
        for (let index = 0; index < this.#db.length; index++) {
            const doc = this.#db[index];
            let found = true;
            for (const key of Object.keys(filters)) {
                if (doc[key] != filters[key]) {
                    found = false;
                    break;
                }
            }
            if (found) {
                foundDoc = doc;
                foundIndex = index;
                break;
            }
        }

        return { doc: foundDoc, index: foundIndex };
    }

    findOne(filters = {}) {
        const { doc } = this.#coreFind(filters);
        return doc;
    }

    deleteOne(filters = {}) {
        const { doc, index } = this.#coreFind(filters);
        if (index > -1) {
            this.#db.splice(index, 1);
        }
        return doc;
    }
}