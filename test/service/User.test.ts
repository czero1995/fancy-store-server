import { initDb, destoryDb } from "../initTest";
import userRepo from "@model/User";
import UserService from "@service/UserService";
let userService: any;
let req: any;
describe("test user service", () => {
  beforeAll(async () => {
    await initDb();
    userService = new UserService(userRepo);
    req = { body: {}, query: {}, session: {} };
  });
  afterEach(() => {
    req = { body: {}, query: {}, session: {} };
  });
  afterAll(async () => {
    await destoryDb();
  });

  test("test register", async () => {
    await expect(userService.register(req)).rejects.toEqual({
      code: -1,
      msg: "请输入用户名"
    });
    req.body = { user: "user", pwd: "pwd" };
    expect(await userService.register(req)).toEqual({
      code: 0,
      msg: "添加成功"
    });
  });

  test("test update", async () => {
    req.headers = { userid: 1 };
    // await expect(userService.update(req)).rejects.toEqual({
    //   code: -1,
    //   msg: '请传入用户uid'
    // })
    req.body = { uid: 1, params: { user: "user1" } };
    expect(await userService.update(req)).toEqual({
      code: 0,
      msg: "更新成功"
    });
  });

  test("test login", async () => {
    req.body = { user: "user" };
    expect(await userService.login(req)).toEqual({
      code: -1,
      msg: "用户不存在"
    });
    req.body = { user: "user1" };
    expect(await userService.login(req)).toEqual({
      code: -1,
      msg: "密码错误"
    });
    req.body = { user: "user1", pwd: "pwd" };
    // expect(await userService.login(req)).toEqual({ code: 0, msg: '登录成功' })
  });
});
