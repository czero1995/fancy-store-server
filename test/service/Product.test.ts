import { initDb, destoryDb } from "../initTest";
import productRepo from "@model/Product";
import ProductService from "@service/ProductService";
let productService: any;
let req: any;
let productId: number;
describe("test product service", () => {
  beforeAll(async () => {
    await initDb();
    productService = new ProductService(productRepo);
    req = { body: {}, query: {} };
  });
  afterEach(() => {
    req = { body: {}, query: {} };
  });
  afterAll(async () => {
    await destoryDb();
  });

  test("test add", async () => {
    await expect(productService.add(req)).rejects.toEqual({
      code: -1,
      msg: "请传入商品标题"
    });
    req.body = { title: "商品标题", priceNow: 10 };
    expect(await productService.add(req)).toEqual({
      code: 0,
      msg: "添加成功"
    });
  });
  test("test all", async () => {
    req.query.category = {};
    const data = await productService.all(req);
    productId = data[0].uid;
    expect(data.length).toBe(1);
  });

  test("test update", async () => {
    req.query.category = {};
    await expect(productService.update(req)).rejects.toEqual({
      code: -1,
      msg: "请传入商品 uid"
    });
    req.body = { uid: productId, params: { title: "商品标题1" } };
    expect(await productService.update(req)).toEqual({
      code: 0,
      msg: "更新成功"
    });
    expect((await productService.all(req))[0].title).toBe("商品标题1");
  });

  test("test detail", async () => {
    await expect(productService.detail(req)).rejects.toEqual({
      code: -1,
      msg: "请传入商品 uid"
    });
    req.query = { uid: productId };
    expect(await productService.detail(req)).not.toBeNull();
  });

  test("test delete", async () => {
    req.query.category = {};
    await expect(productService.delete(req)).rejects.toEqual({
      code: -1,
      msg: "请传入商品 uid"
    });
    req.body = { uid: productId };
    expect(await productService.delete(req)).toEqual({
      code: 0,
      msg: "删除成功"
    });
    expect((await productService.all(req)).length).toBe(0);
  });
});
