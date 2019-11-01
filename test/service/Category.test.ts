import { initDb, destoryDb } from "../initTest";
import categoryRepo from "@model/Category";
import CategoryService from "@service/CategoryService";
import RedisMock from "../redis";
let categoryService: any;
let req: any;
let categoryUid: number;
describe("test category service", () => {
  beforeAll(async () => {
    await initDb();
    categoryService = new CategoryService(categoryRepo, RedisMock);
    req = { body: {}, query: {} };
  });
  afterEach(() => {
    req = { body: {}, query: {} };
  });
  afterAll(async () => {
    await destoryDb();
  });

  test("test add", async () => {
    await expect(categoryService.add(req)).rejects.toEqual({
      code: -1,
      msg: "请传入分类名字"
    });
    req.body = { title: "分类名字" };
    expect(await categoryService.add(req)).toEqual({
      code: 0,
      msg: "添加成功"
    });
  });
  test("test all", async () => {
    const data = await categoryService.all(req);
    categoryUid = data[0].uid;
    expect(data.length).toBe(1);
  });

  test("test update", async () => {
    await expect(categoryService.update(req)).rejects.toEqual({
      code: -1,
      msg: "请传入分类uid"
    });
    req.body = { uid: categoryUid, params: { title: "分类名字1" } };
    expect(await categoryService.update(req)).toEqual({
      code: 0,
      msg: "更新成功"
    });
    expect((await categoryService.all(req))[0].title).toBe("分类名字1");
  });

  test("test delete", async () => {
    await expect(categoryService.delete(req)).rejects.toEqual({
      code: -1,
      msg: "请传入分类uid"
    });
    req.body = { uid: categoryUid };
    expect(await categoryService.delete(req)).toEqual({
      code: 0,
      msg: "删除成功"
    });
    expect((await categoryService.all(req)).length).toBe(0);
  });
});
