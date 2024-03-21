const {v2:cloudinary} = require("cloudinary");
const fs = require("fs");
cloudinary.config({ 
  cloud_name: 'ddnn7tlxs', 
  api_key: '739669685737831', 
  api_secret: 'UzMcPEQVzdKTa3WKlBVhm1mC_Cs' 
});


cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
  { public_id: "olympic_flag" }, 
  function(error, result) {console.log(result); });