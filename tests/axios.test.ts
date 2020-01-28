import rocksetConfigure from "../src/index";
import axios from "axios";

const basePath = process.env.ROCKSET_HOST || "https://api.rs2.usw2.rockset.com";
const apikey = process.env.ROCKSET_APIKEY as string;

if (apikey == null) {
  throw "No ROCKSET_APIKEY specified. Please specify an environment variable ROCKSET_APIKEY with your Rockset key. eg: $ export ROCKSET_APIKEY=...";
}

const customFetchAxios = async (url: string, options: any) => {
  const { headers, method, body: data, queryParams: params } = options;
  const res = await axios.request({
    url,
    headers,
    method,
    data,
    params
  });

  return res.data;
};

const rockset = rocksetConfigure(apikey, basePath, customFetchAxios);
const collection =
  "test_collection_" +
  Math.random()
    .toString(36)
    .slice(2);

const savedQuery =
  "test_query_" +
  Math.random()
    .toString(36)
    .slice(2);

afterAll(function() {});
describe("Rockset Unit Tests", function() {
  test("creating a collection", async () => {
    try {
      const result = await rockset.collections.createCollection("commons", {
        name: collection
      });
      expect(result).toMatchObject({
        data: {
          created_at: null,
          created_by: null,
          description: null,
          field_mappings: [],
          name: collection,
          retention_secs: null,
          sources: [],
          stats: null,
          status: "CREATED",
          workspace: "commons"
        }
      });
    } catch (e) {
      fail(e);
    }
  });

  test("running a query", async () => {
    const out = await rockset.queries.query({
      sql: {
        query: "Select count(*) from _events;"
      }
    });
    expect(out).toMatchObject({
      collections: ["commons._events"],
      column_fields: [{ name: "?count", type: "" }],
      results: [{ "?count": expect.anything() }],
      stats: { rows_scanned: 0 }
    });
  });

  test("deleting a collection", async () => {
    try {
      const result = await rockset.collections.deleteCollection(
        "commons",
        collection
      );
      expect(result).toMatchObject({
        data: {
          created_at: null,
          created_by: null,
          description: null,
          field_mappings: [],
          name: collection,
          retention_secs: null,
          sources: [],
          stats: null,
          status: "DELETED",
          workspace: "commons"
        }
      });
    } catch (e) {
      fail(e);
    }
  });

  test("creating a saved query", async () => {
    try {
      const result = await rockset.queries.createSavedQuery("commons", {
        name: savedQuery,
        query_sql: 'SELECT :param as echo',
        parameters: [{
          name: 'param',
          type: 'string',
          default_value: 'Hello world!'
        }]
      });
      expect(result).toMatchObject({
        data: {
          created_at: expect.anything(),
          created_by: expect.anything(),
          name: savedQuery,
          workspace: "commons",
          version: 1,
          version_tag: null,
          query_sql: 'SELECT :param as echo',
          parameters: [{
            name: 'param',
            type: 'string',
            default_value: 'Hello world!'
          }],
          stats: expect.anything(),
          collections: [],
        }
      });
    } catch (e) {
      fail(e);
    }
  });

  test("running a saved query with default parameters", async () => {
    try {
      const result = await rockset.queries.runSavedQuery("commons", savedQuery, 1);
      expect(result).toMatchObject({
        results: [{
          "echo": "Hello world!",
        }],
        stats: expect.anything(),
      });
    } catch (e) {
      fail(e);
    }
  });

  test("running a saved query with custom parameters", async () => {
    try {
      const result = await rockset.queries.runSavedQuery("commons", savedQuery, 1, {
        parameters: [{
          name: 'param',
          value: 'All work and no play makes Jack a dull boy',
        }]
      });
      expect(result).toMatchObject({
        results: [{
          "echo": "All work and no play makes Jack a dull boy",
        }],
        stats: expect.anything(),
      });
    } catch (e) {
      fail(e);
    }
  });

  test("deleting a saved query", async () => {
    try {
      const result = await rockset.queries.deleteSavedQuery("commons", savedQuery);
      expect(result).toMatchObject({
        data: {
          created_at: expect.anything(),
          created_by: expect.anything(),
          name: savedQuery,
          workspace: "commons",
          version: 1,
          version_tag: null,
          query_sql: 'SELECT :param as echo',
          parameters: [{
            name: 'param',
            type: 'string',
            default_value: 'Hello world!'
          }],
          stats: expect.anything(),
          collections: [],
        }
      });
    } catch (e) {
      fail(e);
    }
  });


});
