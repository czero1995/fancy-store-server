import { initDb, destoryDb } from "../initTest";
import bannerRepo from "@model/Banner";
import BannerService from "@service/BannerService";
import RedisMock from "../redis";
let bannerService: any;
let req: any;
let bannerUid: number;
describe("test banner service", () => {
  beforeAll(async () => {
    await initDb();
    bannerService = new BannerService(bannerRepo, RedisMock);
    req = { body: {}, query: {} };
  });
  afterEach(() => {
    req = { body: {}, query: {} };
  });
  afterAll(async () => {
    await destoryDb();
  });

  test("test add", async () => {
    await expect(bannerService.add(req)).rejects.toEqual({
      code: -1,
      msg: "请传入Banner标题"
    });
    req.body = { title: "Banner标题" };
    expect(await bannerService.add(req)).toEqual({
      code: 0,
      msg: "添加成功"
    });
  });
  test("test all", async () => {
    const data = await bannerService.all(req);
    bannerUid = data[0].uid;
    expect(data.length).toBe(1);
  });

  test("test update", async () => {
    await expect(bannerService.update(req)).rejects.toEqual({
      code: -1,
      msg: "请传入Banner uid"
    });
    req.body = { uid: bannerUid, params: { title: "Banner标题1" } };
    expect(await bannerService.update(req)).toEqual({
      code: 0,
      msg: "更新成功"
    });
    expect((await bannerService.all(req))[0].title).toBe("Banner标题1");
  });

  test("test detail", async () => {
    await expect(bannerService.detail(req)).rejects.toEqual({
      code: -1,
      msg: "请传入Banner uid"
    });
    req.query = { uid: bannerUid };
    expect(await bannerService.detail(req)).not.toBeNull();
  });

  test("test delete", async () => {
    await expect(bannerService.delete(req)).rejects.toEqual({
      code: -1,
      msg: "请传入Banner uid"
    });
    req.body = { uid: bannerUid };
    expect(await bannerService.delete(req)).toEqual({
      code: 0,
      msg: "删除成功"
    });
    expect((await bannerService.all(req)).length).toBe(0);
  });
});
