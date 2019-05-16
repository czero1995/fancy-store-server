const express = require('express')
const qiniu = require('qiniu')
const Router = express.Router()
const config = require('../../../config/config')

const fs = require('fs')
const qn = require('qn')
// 空间名
const bucket = config.qiniu.Bucket
// 七牛云
const client = qn.create({
  accessKey: 'n83SaVzVtzNbZvGCz0gWsWPgpERKp0oK4BtvXS-Y',
  secretKey: '1Uve9T2_gQX9pDY0BFJCa1RM_isy9rNjfC4XVliW',
  bucket: bucket,
  origin: 'http://ouibvkb9c.bkt.clouddn.com'
})

var mac = new qiniu.auth.digest.Mac(
  config.qiniu.AccessKey,
  config.qiniu.SecretKey
)
var config2 = new qiniu.conf.Config()
// 这里主要是为了用 node sdk 的 form 直传，结合 demo 中 form 方式来实现无刷新上传
config2.zone = qiniu.zone.Zone_z2
var formUploader = new qiniu.form_up.FormUploader(config2)
var putExtra = new qiniu.form_up.PutExtra()
var options = {
  scope: config.qiniu.Bucket,
  deleteAfterDays: 7,
  returnBody:
    '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
}

var putPolicy = new qiniu.rs.PutPolicy(options)
var bucketManager = new qiniu.rs.BucketManager(mac, null)

/*获取七牛云上传token*/
Router.post('/qiniu', function(req, res) {
  var token = putPolicy.uploadToken(mac)
  return res.json({
    success: true,
    token: token,
    domain: config.qiniu.Domain
  })
})

module.exports = Router
