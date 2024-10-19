const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

app.use(cors())
app.use(express.json())
app.use(express.static("./images1"))

const stripe = require('stripe')('sk_test_51P0XTmSJuICMICmp3QhQhzr3hMOPy1P4aLAcj2iv4HD6Omf4d6ShfjvBVP6N1baoE20dHAr3YeeM5ZCOEB4M6KOF00gEsqpbke')


const nodemailer = require('nodemailer');
const { log } = require('console')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'viknesh13101995@gmail.com',
    pass: 'eewq mkzh xsqn opxj'
  },
});



const db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: '',
  database: 'samydecors',
})


// --------------date--------------------
function getdate() {
  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  return (`${year}-${month}-${day}`);
}


function getdate1() {
  const date1 = new Date();

  let day1 = date1.getDate();
  let month1 = date1.getMonth() + 1;
  let year1 = date1.getFullYear();
  let hours = date1.getHours();
  let minutes = date1.getMinutes();
  let seconds = date1.getSeconds();

  return (`${day1}${month1}${year1}${hours}${minutes}${seconds}`);
}


//-----------------image upload------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images1')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  }
})

const upload = multer({
  storage: storage
})
// -----------------------------------------------------


// ------------------------image delete-----------------
// fs.unlink("images1/"+result[0].image, (err) => {
//     if (err) {
//       console.error(err);
//       return;
//     }
//     console.log('File deleted successfully');
//   });
// -----------------------------------------------------


// ------------User Register------------
app.post('/UserRegister', (req, res) => {
  db.query("select * from userdetails where email= ? or phone = ?", [req.body.remail, req.body.rphone],
    (err, result) => {
      if (err) {
        console.log(err)
      }
      if (result.length > 0) {
        res.send("Alreadyexist")
      }
      else {
        db.query('INSERT INTO userdetails (name,phone,email,password,address) VALUES (?,?,?,?,?)',
          [req.body.ruser, req.body.rphone, req.body.remail, req.body.rpassword,req.body.raddress],
          (err, result) => {
            if (err) {
              res.send('error')
              console.log(err)
            } else {
              res.send('Success')
            }
          }
        )
      }
    }
  )
})
// -------------------------------------


//-----------------------user login----------------------------------
app.post('/UserLogin', (req, res) => {
  db.query("select * from userdetails where email= ? and password = ?", [req.body.lemail, req.body.lpassword],
    (err, result) => {
      if (err) {
        console.log(err)
      }
      else {
        if (result.length > 0) {
          res.send(["success",
            result[0].name,
            result[0].user_id,
            result[0].phone,
            result[0].email,
            result[0].address])
        }
        else {
          res.send("failed")
        }
      }
    }
  )
})
// ------------------------------------------------------------------


// ----------------------------------Update Password-----------------
//user change password
app.post('/UserPassword', (req, res) => {
  db.query("select * from userdetails where email= ?", [req.body.upemail],
    (err, result) => {
      if (err) {
        console.log(err)
      }
      else {
        if (result.length > 0) {
          ////////////
          db.query("update userdetails set password=? where email=?", [req.body.uppassword, req.body.upemail],
            (err, result) => {
              if (err) {
                console.log(err);
                res.send("failed")
              }
              else {
                res.send("success")
              }
            }
          )
          ////////////////
        }
        else {
          res.send("failed")
        }
      }
    }
  )
})
// ------------------------------------------------------------------




// ------------admin Register------------
app.post('/AdminRegister', (req, res) => {
  db.query("select * from admindetails",
    (err, result) => {
      if (err) {
        console.log(err)
      }
      if (result.length > 0) {
        res.send("Alreadyexist")
      }
      else {
        db.query('INSERT INTO admindetails (name,phone,email,password) VALUES (?,?,?,?)',
          [req.body.ruser, req.body.rphone, req.body.remail, req.body.rpassword],
          (err, result) => {
            if (err) {
              res.send('error')
              console.log(err)
            } else {
              res.send('Success')
            }
          }
        )
      }
    }
  )
})
// -------------------------------------


//-----------------------admin login----------------------------------
app.post('/AdminLogin', (req, res) => {
  db.query("select * from admindetails where email= ? and password = ?", [req.body.lemail, req.body.lpassword],
    (err, result) => {
      if (err) {
        console.log(err)
      }
      else {
        if (result.length > 0) {
          res.send(["success", result[0].name, result[0].uid])
        }
        else {
          res.send("failed")
        }
      }
    }
  )
})
// ------------------------------------------------------------------



//------------------------admin change password---------------------
app.post('/AdminPassword', (req, res) => {
  db.query("select * from admindetails where email= ?", [req.body.upemail],
    (err, result) => {
      if (err) {
        console.log(err)
      }
      else {
        if (result.length > 0) {
          ////////////
          db.query("update admindetails set password=? where email=?", [req.body.uppassword, req.body.upemail],
            (err, result) => {
              if (err) {
                console.log(err);
                res.send("failed")
              }
              else {
                res.send("success")
              }
            }
          )
          ////////////////
        }
        else {
          res.send("failed")
        }
      }
    }
  )
})
// ------------------------------------------------------------------


//-----------------------get user details----------------------------------
app.post('/GetUserdetails', (req, res) => {
  db.query("select * from userdetails where user_id = ?", [req.body.uid],
    (err, result) => {
      if (err) {
        console.log(err)
      }
      else {
        res.send(result);
      }
    }
  )
  })
  // ------------------------------------------------------------------




  //-----------------------add category----------------------------------
  app.post('/AddCategory', (req, res) => {
    db.query("select * from category where cname= ?", [req.body.addcategoryname],
      (err, result) => {
        if (err) {
          console.log(err)
        } 
        if(result.length>0){
          res.send("Alreadyexist")
        }
        else
        {  
          db.query('INSERT INTO category (cname) VALUES (?)',
          [req.body.addcategoryname],
              (err, result) => {
                if (err) {
                  res.send('error')
                  console.log(err)
                } else {
                  res.send('Success')
                }
              }
            )
        }
      }
    )
  })
  
  // ----------------------view category---------------------------------
app.get("/ViewCategory", (req, res) => {
  db.query("select * from category", (err, result) => {
    if (err) {
      console.log(err);
    }
    else {
      res.send(result);
    }
  })
})


//-----------------------add subcategory----------------------------------
app.post('/AddSubcategory', (req, res) => {
  db.query("select * from subcategory where scname= ? and cid = ?", [req.body.addsubcategoryname,req.body.addcid],
    (err, result) => {
      if (err) {
        console.log(err)
      }
      if(result.length>0){
        res.send("Alreadyexist")
      }
      else
      {  
        db.query('INSERT INTO subcategory (cid,scname) VALUES (?,?)',
        [req.body.addcid,req.body.addsubcategoryname],
            (err, result) => {
              if (err) {
                res.send('error')
                console.log(err)
              } else {
                res.send('Success')
              }
            }
          )
      }
    }
  )
})

// ----------------------view subcategory---------------------------------
app.get("/ViewSubcategory", (req, res) => {
db.query("select category.cname, subcategory.* from category RIGHT JOIN subcategory ON category.cid = subcategory.cid order by subcategory.cid", (err, result) => {
  if (err) {
    console.log(err);
  }
  else {
    res.send(result);
  }
})
})


//-----------------------get sub category details on category----------------------------------
app.post('/GetScdetails', (req, res) => {
  db.query("select * from subcategory where cid = ?", [req.body.cid],
    (err, result) => {
      if (err) {
        console.log(err)
      }
      else {
        res.send(result);
      }
    }
  )
  })
  // ------------------------------------------------------------------


  //  --------------------add products-------------------------------
  app.post('/AddProduct',upload.single('addpimg'),(req,res)=>{
    const addpimg=req.file.filename;
    const datep=getdate();
    db.query(
      'INSERT INTO product (cid,scid,name,price,quantity,description,image,datep) VALUES (?,?,?,?,?,?,?,?)',
      [req.body.addpcid,req.body.addpscid,req.body.addpname,req.body.addpprice,req.body.addpqty,req.body.addpdescription,addpimg,datep],
      (err, result) => {
        if (err) {
          console.log(err);
          res.send("failed")
        }
        else {
          res.send("success")
        }
      }
    )
  })

  // ----------------------view products---------------------------------
app.get("/ViewProduct", (req, res) => {
  db.query("select * from product", (err, result) => {
    if (err) {
      console.log(err);
    }
    else {
      res.send(result);
    }
  })
  })


    // -----------------------product list-----------------------------------
app.post('/ProductList', (req, res) => {
  db.query("select * from product where scid = ?", [req.body.scid],
    (err, result) => {
      if (err) {
        console.log(err)
      }
      else {
        res.send(result);
      }
    }
  )
  })


    // ---------------------t product details productdetails page----------------------
app.post('/Productdetailspage', (req, res) => {
  db.query("select * from product where pid = ?", [req.body.pid],
    (err, result) => {
      if (err) {
        console.log(err)
      }
      else {
        res.send(result);
      }
    }
  )
  })


    // ---------------------------get product search from navbar-------------------------
    app.post('/GetProductsearch', (req, res) => {
      db.query("select product.pid,product.name,subcategory.scname from product inner join subcategory on product.scid=subcategory.scid where product.name like CONCAT('%', ?, '%')", [req.body.pn],
        (err, result) => {
          if (err) {
            console.log(err)
          }
          else {
            res.send(result);
          }
        }
      )
      })


      // -----------product details.js    addptoc------------------
    app.post('/addptoc', (req, res) => {
      db.query("select * from cart where pid=? and uid=?", [req.body.pid,req.body.uid],
        (err, result) => {
          if (err) {
            console.log(err)
          }
          if(result.length>0){
            res.send("alreadyexist")
          }
          else {
            db.query(
              'INSERT INTO cart (uid,cid,scid,pid,name,price) VALUES (?,?,?,?,?,?)',
              [req.body.uid,req.body.cid,req.body.scid,req.body.pid,req.body.name,req.body.price],
              (err, result) => {
                if (err) {
                  console.log(err);
                  res.send("failed")
                }
                else {
                  res.send("success")
                }
              }
            )
          }
        }
      )
      })



      //-----------------------get cart details----------------------------------
app.post('/Getcartdetails', (req, res) => {
  db.query("select * from cart where uid = ?", [req.body.uid],
    (err, result) => {
      if (err) {
        console.log(err)
      }
      else {
        res.send(result);
      }
    }
  )
  })
  // ------------------------------------------------------------------


      //-----------------------pd homepage----------------------------------
      app.get('/ProductListhome', (req, res) => {
        db.query("select p.*,c.scname as subcategory from product p join subcategory c on p.scid=c.scid order by p.pid desc limit 7",
          (err, result) => {
            if (err) {
              console.log(err)
            }
            else {
              res.send(result);
            }
          }
        )
        })
        // ------------------------------------------------------------------

// ------------add count------------
app.get('/addcount', (req, res) => {
  datep=getdate();
  db.query("select * from vcount where datep = ?", [datep],
    (err, result) => {
      if (err) {
        console.log(err)
      }
      if (result.length > 0) {
        db.query('update vcount set count=count+1 where datep=?',[datep])
      }
      else {
        db.query('INSERT INTO vcount (datep,count) VALUES (?,?)',
          [datep,1])
      }
    }
  )
})
// -------------------------------------


// --------------------------product details.js  productdetailsGetproduct-----------------
app.post("/productdetailsGetproduct", (req, res) => {
  db.query("select * from product where pid=?", [req.body.pid], (err, result) => {
    if (err) {
      console.log(err);
    }
    else {
      db.query(" SELECT AVG(rtst) AS rv FROM rating WHERE pid = ?", [req.body.pid], (err, result1) => {
        if (err) {
          console.log(err);
        }
        else {
    
    res.send([result,result1])
        }
      })

    }
  })
})




// ----------------------productdetails js view comment---------------------------------
app.post("/productdetailsGetcomment", (req, res) => {
  db.query("select * from rating where pid=?", [req.body.pid], (err, result) => {
    if (err) {
      console.log(err);
    }
    else {
      res.send(result);
    }
  })
})



// ----------------------productdetails js addr---------------------------------
app.post("/addr", (req, res) => {
  const datep = getdate();
  db.query("insert into rating (uid,name,email,rtst,co,pid,datep) values (?,?,?,?,?,?,?)", [req.body.uid, req.body.name, req.body.email, req.body.rtst, req.body.co, req.body.pid, datep], (err, result) => {
    if (err) {
      console.log(err);
    }
    else {
      res.send("success");
    }
  })
})


// ----------------------add to cart---------------------------------
app.post("/addtocart", (req, res) => {
  db.query("select * from cart where pid=? and uid=?", [req.body.pid, req.body.uid], (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result.length > 0) {
      res.send("exist");
    }
    else {
      db.query("insert into cart (pid,uid) values (?,?)", [req.body.pid, req.body.uid], (err, result) => {
        if (err) {
          console.log(err);
        }
        else {
          res.send("success");
        }
      })
    }
  })
})




// ----------------------view cart---------------------------------
app.post("/viewCart", (req, res) => {
  db.query("SELECT c.cart_id, c.uid, c.pid,c.cqty, p.name,p.price,p.quantity,p.image FROM cart c JOIN product p ON c.pid = p.pid where c.uid=?",
    [req.body.uid], (err, result) => {
      if (err) {
        console.log(err);
      }
      else {
        res.send(result);
      }
    })
})


// ----------------------up cart---------------------------------
app.post("/upcart", (req, res) => {
  db.query("update cart set cqty=? where uid=? and cart_id=?",
    [req.body.q, req.body.uid, req.body.cartid], (err, result) => {
      if (err) {
        console.log(err);
      }
      else {
        res.send("success");
      }
    })
})



// ----------------------dl cart---------------------------------
app.post("/dlcart", (req, res) => {
  db.query("delete from cart where uid=? and cart_id=?",
    [req.body.uid, req.body.cartid], (err, result) => {
      if (err) {
        console.log(err);
      }
      else {
        res.send("success");
      }
    })
})



// Route handler for POST /fnckout
app.post("/fnckout", async (req, res) => {
  try {
    var billno = getdate1();
    billno=`${billno}-${req.body.uid}`;
    const datep = getdate();

    // Insert into checkout table
    await db.query("INSERT INTO checkout (uid, billno, datep, pid, name, description,image, price, qty, totalprice,fdt,tdt,ftp,tdays) SELECT ?, ?, ?, c.pid AS pid, p.name AS name, p.description AS description,p.image AS image,p.price AS price, c.cqty AS qty, (p.price * c.cqty) AS totalprice,? AS fdt,? AS tdt,? AS ftp,? AS tdays FROM cart c JOIN product p ON c.pid = p.pid WHERE c.uid = ?", 
    [req.body.uid, billno, datep
    ,req.body.fdt,req.body.tdt,req.body.ftp,req.body.tdays, req.body.uid
    ]);

    // Update product table
    await db.query("UPDATE product p JOIN (SELECT pid, SUM(cqty) AS total_qty FROM cart WHERE uid = ? GROUP BY pid) c ON p.pid = c.pid SET p.quantity = p.quantity - c.total_qty", [req.body.uid]);

// Insert into billingstb table
await db.query("INSERT INTO billingstb (uid, name, phone, email,billno) VALUES (?, ?, ?, ?, ?)",
  [req.body.uid, req.body.name, req.body.phone,  req.body.email, billno]);

    // Delete from cart table
    await db.query("DELETE FROM cart WHERE uid=?", [req.body.uid]);


    // ---------------------------------

    transporter.sendMail({
      from: '"Samy Decorators" <viknesh13101995@gmail.com>',
      to: req.body.email,
      subject: "Your Order has been booked successfully",
      text: `Hi,${req.body.name} Order hasbeen placed successfully,
 Bill Number : ${billno}
 Placed On : ${datep}
 You may track your status in Billing Details Page,
 Total Amount : ${req.body.ftp*2}
 You Paid : ${req.body.ftp}`
      // html: "<b>There is a new article. It's about sending emails, check it out!</b>",
    }).then(info => {
      // console.log({info});
    }).catch(console.error);
    // ---------------------------------



    res.send("success");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error occurred");
  }
});






// Route handler for POST /fnckout
app.post("/fnckout12", async (req, res) => {
  try {
    var billno = getdate1();
    billno=`${billno}-${req.body.uid}`;
    const datep = getdate();

    return stripe.customers.create(
      {
        email: req.body.token.email,
        source: req.body.token.id
      }
    ).then((customer) => {
      stripe.paymentIntents.create({
        amount: (req.body.ftp * 100),
        currency: 'inr',
        customer: customer.id,
        receipt_email: req.body.token.email,
        description: `uid : ${req.body.uid}
        email : ${req.body.email}
        Name : ${req.body.name}
        Phone: ${req.body.phone}
        Billno : ${billno}
        Date : ${datep}`
      }).then(() => {

        res.send("success");

      }).catch((err) => {
        console.log(err);

      })
    })


  } catch (err) {
    console.error(err);
    res.status(500).send("Error occurred");
  }
});


// ----------------------view my order---------------------------------
app.post("/vieworder", (req, res) => {
  db.query("SELECT billno,datep,status,fdt,tdt,tdays,ftp,advpdt, COUNT(*) AS item, SUM(totalprice) AS tprice FROM checkout WHERE uid = ? and (status=0 and advdt=0) GROUP BY billno order by status",
    [req.body.uid], (err, result) => {
      if (err) {
        console.log(err);
      }
      else {
        res.send(result);
      }
    })
})


// ----------------------vieworderfpd---------------------------------
app.post("/vieworderfpd", (req, res) => {
  db.query("SELECT billno,datep,status,fdt,tdt,tdays,ftp,advpdt, COUNT(*) AS item, SUM(totalprice) AS tprice FROM checkout WHERE uid = ? and (status=0 and advdt=1) GROUP BY billno order by status",
    [req.body.uid], (err, result) => {
      if (err) {
        console.log(err);
      }
      else {
        res.send(result);
      }
    })
})



// ----------------------vieworderbilling---------------------------------
app.post("/vieworderbilling", (req, res) => {
  db.query("SELECT billno,datep,status,fdt,tdt,tdays,ftp,advpdt, COUNT(*) AS item, SUM(totalprice) AS tprice FROM checkout WHERE uid = ? and status=1 GROUP BY billno order by status",
    [req.body.uid], (err, result) => {
      if (err) {
        console.log(err);
      }
      else {
        res.send(result);
      }
    })
})


// ----------------------product details---------------------------------
app.post("/pdtls", (req, res) => {
  db.query("SELECT * from checkout  WHERE uid = ? and billno=?",
    [req.body.uid, req.body.billno], (err, result) => {
      if (err) {
        console.log(err);
      }
      else {
        db.query("SELECT * from billingstb  WHERE uid = ? and billno=?",
          [req.body.uid, req.body.billno], (err, result1) => {
            if (err) {
              console.log(err);
            }
            else {
              res.send([result, result1]);
            }
          })
      }
    })
})



// ----------------------view my order---------------------------------
app.get("/vieworderadmin", (req, res) => {
  db.query("SELECT billno,datep,status,fdt,tdt,tdays,ftp,advpdt, COUNT(*) AS item, SUM(totalprice) AS tprice FROM checkout WHERE status=0 and advdt=0 GROUP BY billno order by status"
  ,(err, result) => {
      if (err) {
        console.log(err);
      }
      else {
        res.send(result);
      }
    })
})


// ----------------------vieworderfpdadmin---------------------------------
app.get("/vieworderfpdadmin", (req, res) => {
  db.query("SELECT billno,datep,status,fdt,tdt,tdays,ftp,advpdt, COUNT(*) AS item, SUM(totalprice) AS tprice FROM checkout WHERE status=0 and advdt=1 GROUP BY billno order by status"
  ,(err, result) => {
      if (err) {
        console.log(err);
      }
      else {
        res.send(result);
      }
    })
})


// ----------------------product details---------------------------------
app.post("/pdtlsadmin", (req, res) => {
  db.query("SELECT * from checkout  WHERE billno=?",
    [req.body.billno], (err, result) => {
      if (err) {
        console.log(err);
      }
      else {
        db.query("SELECT * from billingstb  WHERE billno=?",
          [req.body.billno], (err, result1) => {
            if (err) {
              console.log(err);
            }
            else {
              res.send([result, result1]);
            }
          })
      }
    })
})


// ----------------------uptopd---------------------------------
app.post("/uptopd", (req, res) => {
  const datep = getdate();
  db.query("update checkout set advdt=1,advpdt=? where billno=?",[datep,req.body.billno]
  ,(err, result) => {
      if (err) {
        console.log(err);
      }
      else {
        res.send("success");
      }
    })
})


// ----------------------uptopd1---------------------------------
app.post("/uptopd1", (req, res) => {
  db.query("update checkout set status=1 where billno=?",[req.body.billno]
  ,(err, result) => {
      if (err) {
        console.log(err);
      }
      else {
// ----------------------------------------------------------


db.query("UPDATE product p JOIN (SELECT c.pid, SUM(c.qty) AS checkout_qty FROM checkout c WHERE c.billno = ? GROUP BY c.pid) AS c ON p.pid = c.pid SET p.quantity = p.quantity + c.checkout_qty",[req.body.billno]
,(err, result) => {
    if (err) {
      console.log(err);
    }
    else {
      res.send("success");
    }
  })


 //----------------------------------------------------
//  res.send("success");
      }
    })
})


// ----------------------vieworderbillingadmin---------------------------------
app.get("/vieworderbillingadmin", (req, res) => {
  db.query("SELECT billno,datep,status,fdt,tdt,tdays,ftp,advpdt, COUNT(*) AS item, SUM(totalprice) AS tprice FROM checkout WHERE status=1 GROUP BY billno order by status"
  ,(err, result) => {
      if (err) {
        console.log(err);
      }
      else {
        res.send(result);
      }
    })
})


// ----------------------user details admin---------------------------------
app.get("/adtls1admin", (req, res) => {
  db.query("SELECT * from userdetails", (err, result) => {
    if (err) {
      console.log(err);
    }
    else {
      res.send(result);
    }
  })
})



// ----------------------view count admin---------------------------------
app.get("/viewcountadmin", (req, res) => {
  db.query("SELECT * from vcount", (err, result) => {
    if (err) {
      console.log(err);
    }
    else {
      res.send(result);
    }
  })
})




// ----------------------getuid---------------------------------
app.post("/getuid", (req, res) => {
  db.query("SELECT billno,datep,status,fdt,tdt,tdays,ftp,advpdt, COUNT(*) AS item, SUM(totalprice) AS tprice FROM checkout WHERE status=0 and advdt=0 and uid=? GROUP BY billno order by status",[req.body.uid], (err, result) => {
    if (err) {
      console.log(err);
    }
    else {
      res.send(result);
    }
  })
})



// ----------------------getbillid---------------------------------
app.post("/getbillid", (req, res) => {
  db.query("SELECT billno,datep,status,fdt,tdt,tdays,ftp,advpdt, COUNT(*) AS item, SUM(totalprice) AS tprice FROM checkout WHERE status=0 and advdt=0 and billno=? GROUP BY billno order by status",[req.body.billno], (err, result) => {
    if (err) {
      console.log(err);
    }
    else {
      res.send(result);
    }
  })
})




// ----------------------getuid1---------------------------------
app.post("/getuid1", (req, res) => {
  db.query("SELECT billno,datep,status,fdt,tdt,tdays,ftp,advpdt, COUNT(*) AS item, SUM(totalprice) AS tprice FROM checkout WHERE status=0 and advdt=1 and uid=? GROUP BY billno order by status",[req.body.uid], (err, result) => {
    if (err) {
      console.log(err);
    }
    else {
      res.send(result);
    }
  })
})



// ----------------------getbillid1---------------------------------
app.post("/getbillid1", (req, res) => {
  db.query("SELECT billno,datep,status,fdt,tdt,tdays,ftp,advpdt, COUNT(*) AS item, SUM(totalprice) AS tprice FROM checkout WHERE status=0 and advdt=1 and billno=? GROUP BY billno order by status",[req.body.billno], (err, result) => {
    if (err) {
      console.log(err);
    }
    else {
      res.send(result);
    }
  })
})




app.listen(8081, () => {
  console.log('your server is running')
})