import rocksetConfigure from "../src/index";
import axios from "axios";
import { QueryLambdaVersionResponse } from "../src/codegen/api";

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

const queryLambdaName =
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
      stats: { elapsed_time_ms: expect.anything() }
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

  let queryLambda: QueryLambdaVersionResponse;
  test("creating a Query Lambda", async () => {
    try {
      queryLambda = await rockset.queryLambdas.createQueryLambda("commons", {
        name: queryLambdaName,
        sql: {
          query: 'SELECT :param as echo',
          default_parameters: [{
            name: 'param',
            type: 'string',
            value: 'Hello world!'
          }],
        },
      });
      expect(queryLambda).toMatchObject({
        data: {
          created_at: expect.anything(),
          created_by: expect.anything(),
          name: queryLambdaName,
          workspace: "commons",
          version: expect.anything(),
          description: null,
          sql: { 
            query: 'SELECT :param as echo',
            default_parameters: [{
              name: 'param',
              type: 'string',
              value: 'Hello world!'
            }],
          },
          stats: expect.anything(),
          collections: [],
        }
      });
    } catch (e) {
      fail(e);
    }
  });

  test("running a Query Lambda with default parameters", async () => {
    try {
      const result = await rockset.queryLambdas.executeQueryLambda("commons", queryLambda?.data?.name ?? '', queryLambda?.data?.version ?? '');
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

  test("running a Query Lambda with custom parameters", async () => {
    try {
      const result = await rockset.queryLambdas.executeQueryLambda("commons", queryLambda?.data?.name ?? '', queryLambda?.data?.version ?? '', {
        parameters: [{
          name: 'param',
          type: 'string',
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

  test("deleting a Query Lambda", async () => {
    try {
      const result = await rockset.queryLambdas.deleteQueryLambda("commons", queryLambdaName);
      expect(result).toMatchObject({
        data: {
          last_updated: expect.anything(),
          last_updated_by: expect.anything(),
          name: queryLambdaName,
          workspace: "commons",
        }
      });
    } catch (e) {
      fail(e);
    }
  });
});
