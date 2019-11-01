import express from "express";
import qiniu from "qiniu";
import config from "@config/config";
const Router = express.Router();

const mac = new qiniu.auth.digest.Mac(
  config.qiniu.AccessKey,
  config.qiniu.SecretKey
);

const options = {
  scope: config.qiniu.Bucket,
  deleteAfterDays: 7,
  returnBody:
    '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
};

const putPolicy = new qiniu.rs.PutPolicy(options);

/*获取七牛云上传token*/
Router.post("/qiniu", (req, res) => {
  const token = putPolicy.uploadToken(mac);
  return res.json({
    success: true,
    token,
    domain: config.qiniu.Domain
  });
});

export default Router;
