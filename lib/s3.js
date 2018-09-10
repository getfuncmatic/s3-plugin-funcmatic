var S3 = require('@funcmatic/simple-s3')

class S3Plugin {

 constructor() {
    this.name = 's3'
  }
  
  async start(conf) {
    this.conf = conf
    this.s3 = S3.createInstance({
      accessKeyId: conf.accessKeyId,
      secretAccessKey: conf.secretAccessKey,
      region: conf.region,
      bucket: conf.bucket
    })
  }
  
  async request(event, context) {
    return { service: this.s3 }
  }
}

module.exports = S3Plugin