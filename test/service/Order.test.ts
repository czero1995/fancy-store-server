import { initDb, destoryDb } from "../initTest";
import orderRepo from "@model/Order";
import productRepo from "@model/Product";
import OrderService from "@service/OrderService";
let orderService: any;
let orderId: number;
let req: any;
describe("test product service", () => {
  beforeAll(async () => {
    await initDb();
    orderService = new OrderService(orderRepo, productRepo);
    req = { body: {}, query: {}, session: {} };
  });
  afterEach(() => {
    req = { body: {}, query: {}, session: {} };
  });
  afterAll(async () => {
    await destoryDb();
  });

  test("test add", async () => {
    await expect(orderService.add(req)).rejects.toEqual({
      code: -1,
      msg: "请传入productId"
    });
    req.body = { productIds: [{ uid: 1, num: 1 }], address: {} };
    req.headers = { userid: 1 };
    expect(await orderService.add(req)).toEqual({
      code: 0,
      msg: "添加成功"
    });
  });
  test("test all", async () => {
    req.headers = { userid: 1 };
    const data = await orderService.all(req);
    orderId = data[0].uid;
    expect(data.length).toBe(1);
  });

  test("test delete", async () => {
    await expect(orderService.delete(req)).rejects.toEqual({
      code: -1,
      msg: "请传入订单uid"
    });
    req.body = { uid: orderId };
    req.headers = { userid: 1 };
    expect(await orderService.delete(req)).toEqual({
      code: 0,
      msg: "删除成功"
    });
    expect((await orderService.all(req)).length).toBe(0);
  });
});
