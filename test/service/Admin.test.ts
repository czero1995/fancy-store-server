import { initDb, destoryDb } from "../initTest";
import adminRepo from "@model/Admin";
import AdminService from "@service/AdminService";
import cookieParser from "cookie-parser";
let adminService: any;
let req: any;
let res: any;
describe("test admin service", () => {
  beforeAll(async () => {
    await initDb();
    adminService = new AdminService(adminRepo);
    req = { body: {}, query: {}, session: {} };
  });
  afterEach(() => {
    req = { body: {}, query: {}, session: {} };
  });
  afterAll(async () => {
    await destoryDb();
  });

  test("test register", async () => {
    await expect(adminService.register(req)).rejects.toEqual({
      code: -1,
      msg: "请输入管理员用户名"
    });
    req.body = { admin: "admin", pwd: "pwd" };
    expect(await adminService.register(req)).toEqual({
      code: 0,
      msg: "添加成功"
    });
  });

  test("test update", async () => {
    await expect(adminService.update(req)).rejects.toEqual({
      code: -1,
      msg: "请传入admin uid"
    });
    req.body = { uid: 1, params: { admin: "admin1" } };
    expect(await adminService.update(req)).toEqual({
      code: 0,
      msg: "更新成功"
    });
  });

  test("test login", async () => {
    req.body = { admin: "admin1" };
    res = {};
    expect(await adminService.login(req, res)).toEqual({
      code: -1,
      msg: "管理员不存在"
    });
    req.body = { admin: "admin", pwd: "pwd1" };
    expect(await adminService.login(req, res)).toEqual({
      code: -1,
      msg: "密码错误"
    });
    // req.body = { admin: 'admin', pwd: 'pwd' }
    // expect(await adminService.login(req, res)).toEqual({
    // 	code: 0,
    // 	msg: '登录成功'
    // })
  });
});
