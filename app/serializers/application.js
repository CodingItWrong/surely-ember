import JSONAPISerializer from '@ember-data/serializer/json-api';

const attributeToOmit = ['createdAt', 'updatedAt', 'deletedAt'];

export default class ApplicationSerializer extends JSONAPISerializer {
  serializeAttribute(snapshot, json, key, attributes) {
    const include = !attributeToOmit.includes(attributes.name);
    if (include) {
      super.serializeAttribute(snapshot, json, key, attributes);
    }
  }
}
