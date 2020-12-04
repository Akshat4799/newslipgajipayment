const express = require("express");
const app = express();
const ejs = require("ejs");
const pdf = require("html-pdf");
const path = require("path");
const fs = require('fs');
const moment = require('moment');
app.use( express.static( "public" ) );
app.set('view engine', 'ejs')
const PORT = process.env.PORT || 4000;
const attendance = require('./payslip.json');



  const totalGaji = attendance.ledger.salary.salary_summary.present_days_wages + attendance.ledger.salary.salary_summary.half_days_wages + attendance.ledger.salary.salary_summary.absent_days_wages + attendance.ledger.salary.salary_summary.paid_holidays_wages
  app.get('/', function(req, res){ 
    res.render('payslip.ejs',{reports:attendance,moment:moment,totalGaji}) 
  });
  app.get("/generateReport", (req, res) => {
    ejs.renderFile(path.join(__dirname, './views/', "payslip.ejs"), {reports: attendance,moment:moment,totalGaji}, (err, data) => {
    if (err) {
        console.log(err);
          res.send(err);
    } else {
       console.log(data);
        let options = {
            "height": "11.25in",
            "width": "8.5in",
            "header": { 
                "height": "-.9in"
            },
            
        };
        pdf.create(data, options).toFile("report.pdf", function (err, data) {
            if (err) {
                res.send(err);
            } else {
            
                res.download('report.pdf',() => {
                    fs.unlinkSync('report.pdf');
                });
            }
        });
    }

});

})
app.listen(4000,() => {

    console.log(`Server is running on port ${PORT}`)
});