import { initDb, destoryDb } from "../initTest";
import cartRepo from "@model/Cart";
import productRepo from "@model/Product";
import CartService from "@service/CartService";
let cartService: any;
let req: any;
describe("test banner service", () => {
  beforeAll(async () => {
    await initDb();
    cartService = new CartService(cartRepo, productRepo);
    req = { body: {}, query: {}, session: {}, headers: {} };
  });
  afterEach(() => {
    req = { body: {}, query: {}, session: {}, headers: {} };
  });
  afterAll(async () => {
    await destoryDb();
  });

  test("test add", async () => {
    req.headers = { userid: 1 };
    await expect(cartService.add(req)).rejects.toEqual({
      code: -1,
      msg: "请传入productId"
    });
    req.body = { productId: 1 };
    expect(await cartService.add(req)).toEqual({
      code: 0,
      msg: "添加成功"
    });
    req.body = { productId: 1 };
    expect(await cartService.cut(req)).toBeUndefined();
  });

  // test('test all', async () => {
  //   req.session = { userName: 'userName' }
  //   expect(await cartService.all(req)).toEqual([])
  // })
});
