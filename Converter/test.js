var strsplit= require('strsplit')

parsedTarget="FRCM"


  parsedTarget=parsedTarget.replace(/['"]+/g, '')
  parsedTarget=parsedTarget.replace(/(\?)*/g, '')
parsedTarget=strsplit(parsedTarget,',');

  console.log(parsedTarget[0])