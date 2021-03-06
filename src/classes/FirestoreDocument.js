import { getDocument, deserialize } from 'instant-firestore-utils';
import Default from './Default';

// Note the difference between `Firestore Document` and `document` in the comments - the latter is a serialized representation of the former

export default class FirestoreDocument extends Default {
  /**
   * Constructor
   * @param {object} db Firestore Database instance
   * @param {string} docRef Firestore Document Reference
   */
  constructor(db, docRef) {
    if (!db) throw new Error('Required Firestore database reference missing.');
    if (!docRef)
      throw new Error('Required Firestore document reference missing.');
    super();
    Default.bind(this, ['create', 'find', 'update', 'delete']);
    this.db = db;
    this.docRef = docRef;
  }

  /**
   * Create a Firestore Document
   * @param {object} attributes Document attributes
   * @param {string} id Document id
   * @param {object} options Options
   */
  async create(attributes, options = {}) {
    try {
      if (options.deserialize) {
        deserialize(attributes, options.deserialize, this.db);
      }
      // We have a docRef so we implicitly have an id
      await this.docRef.set(attributes);
      return await getDocument(this.docRef, options);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find document
   * @param {object} options Options
   */
  async find(options = {}) {
    try {
      return await getDocument(this.docRef, options);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update Firestore Document
   * @param {object} attributes Document attributes
   * @param {object} options Options
   */
  async update(attributes, options = {}) {
    try {
      if (options.deserialize) {
        deserialize(attributes, options.deserialize, this.db);
      }
      await this.docRef.update(attributes);
      return await getDocument(this.docRef, options);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete Firestore Document
   */
  async delete() {
    try {
      const id = this.docRef.id;
      await this.docRef.delete();
      return this.docRef.exists;
    } catch (error) {
      throw error;
    }
  }
}
