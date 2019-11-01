import { initDb, destoryDb } from "../initTest";
import addressRepo from "@model/Address";
import AddressService from "@service/AddressService";
let addressService: any;
let req: any;
let AddressUid: number;
describe("test Address service", () => {
  beforeAll(async () => {
    await initDb();
    addressService = new AddressService(addressRepo);
    req = { body: {}, query: {}, session: {} };
  });
  afterEach(() => {
    req = { body: {}, query: {}, session: {} };
  });
  afterAll(async () => {
    await destoryDb();
  });

  test("test add", async () => {
    await expect(addressService.add(req)).rejects.toEqual({
      code: -1,
      msg: "请输入用户名字"
    });
    req.body = {
      name: "名字",
      tel: "电话号码",
      address: "地址",
      detailAddress: "详细地址"
    };
    req.session = { userName: 11 };
    expect(await addressService.add(req)).toEqual({
      code: 0,
      msg: "添加成功"
    });
  });
  test("test all", async () => {
    req.session = { userName: 11 };
    const data = await addressService.all(req);
    AddressUid = data[0].uid;
    expect(data.length).toBe(1);
  });

  test("test update", async () => {
    await expect(addressService.update(req)).rejects.toEqual({
      code: -1,
      msg: "请传入地址uid"
    });
    req.body = { uid: AddressUid, params: { name: "名字1" } };
    expect(await addressService.update(req)).toEqual({
      code: 0,
      msg: "更新成功"
    });
    expect((await addressService.all(req))[0].title).toBe("名字1");
  });

  test("test delete", async () => {
    await expect(addressService.delete(req)).rejects.toEqual({
      code: -1,
      msg: "请传入地址uid"
    });
    req.body = { uid: AddressUid };
    expect(await addressService.delete(req)).toEqual({
      code: 0,
      msg: "删除成功"
    });
    expect((await addressService.all(req)).length).toBe(0);
  });
});
