var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var mysql = require('mysql2');
var session = require('express-session');

var con = mysql.createConnection({
    host:'localhost',
    user : 'root',
    password : '1234',
    database : 'node_project'

});


var app = express();
app.use(express.static('public'));
app.set('view engine','ejs');


app.listen(8082);
app.use(bodyParser.urlencoded({extended : true}));
app.use(session({secret:"secret"}));




//display home page items
app.get('/', function(req, res) {
    con.query("SELECT * FROM products", (err, result) => {
        if (err) throw err;
        con.query("SELECT * FROM cart",(err,results)=>{
            if (err) throw err;
            res.render('pages/home', { result: result,results:results });
           
    });
    });

});

var total=0;
//display cart items
app.get('/cart',function(req,res){

    con.query("SELECT * FROM cart",(err,result)=>{
        total=0;
        result.forEach(function(item){
            
            total+= item.price * item.quantity ;
        });
            res.render('pages/cartt',{result : result, total : total});
           
    });
       
});


//add to cart button
app.post('/add_to_cart',function(req,res){
    // Access the form data sent in the request body
    const nameProduct = req.body.name ;
    const imageProduct = '/images/'+req.body.image ;
    const trimmedImageProduct = imageProduct.replace(/\s+/g, '');
    const priceProduct = req.body.price ;
    const quantityProduct = req.body.quantity ;
    
    const queryselect = "SELECT * FROM `cart` WHERE image =? ";
    con.query(queryselect, [trimmedImageProduct],(err,rows)=>{
        if (err) {
            console.error('Error inserting data:', err);
            // Handle error as needed
        } else {
            if (rows.length > 0 ) {
                const updateQuery = "UPDATE `cart` SET quantity = quantity + ? WHERE image = ?";
                con.query(updateQuery,[1,trimmedImageProduct],(err,result)=>{
                    if (err) {
                        console.error('Error inserting data:', err);
                         // Handle error as needed 
                    }else{
                        res.redirect('/');
                    }
                });
            }else{
                const query = "INSERT INTO `cart`(`name`, `price`, `image`, `quantity`) VALUES (?, ?, ?, ?)";

                // Execute the query with values passed as an array
                con.query(query, [nameProduct, priceProduct, trimmedImageProduct, quantityProduct], (err, result) => {
                    if (err) {
                        console.error('Error inserting data:', err);
                        // Handle error as needed
                    } else {
                        
                        // Redirect to home page or render a success message
                        res.redirect('/#cardsSection');
                    }
                });
                
            }
        }
    })
  
});



//update button 
app.post('/update' , function(req,res){
    const quantityToUpdate = req.body.myNumber ;
    const cartImage = req.body.cartImage ;

    const updateQuery = "UPDATE `cart` SET quantity =  ? WHERE image = ?";
                con.query(updateQuery,[quantityToUpdate,cartImage],(err,results)=>{
                    if (err) {
                        console.error('Error inserting data:', err);
                         // Handle error as needed 
                    }else{
                        con.query("SELECT * FROM cart",(err,result)=>{
                            total = 0;
                            result.forEach(function(item){
                                total+= item.price * item.quantity ;
                            });
                                res.render('pages/cartt',{result : result, total : total});
                               
                        });
                    }
                });
});

//removeItem button 
app.post('/removeItem' , function(req,res){
    const cartImage = req.body.cartImage ;

    const removeItemQuery = "DELETE FROM `cart` WHERE image = ?";
                con.query(removeItemQuery,[cartImage],(err,results)=>{
                    if (err) {
                        console.error('Error inserting data:', err);
                         // Handle error as needed 
                    }else{
                        con.query("SELECT * FROM cart",(err,result)=>{
                            total = 0;
                            result.forEach(function(item){
                                total+= item.price * item.quantity ;
                            });
                                res.render('pages/cartt',{result : result, total : total});
                               
                        });
                    }
                });
});


//clear_database button 
app.post('/clear_database' , function(req,res){
    const quantityToUpdate = req.body.myNumber ;
    const cartImage = req.body.cartImage ;
    const updateQuery = "DELETE FROM `cart`";
                con.query(updateQuery,(err,results)=>{
                    if (err) {
                        console.error('Error inserting data:', err);
                         // Handle error as needed 
                    }else{
                        con.query("SELECT * FROM cart",(err,result)=>{
                            total = 0;
                            result.forEach(function(item){
                                total+= item.price * item.quantity ;
                            });
                                res.render('pages/cartt',{result : result, total : total});
                               
                        });
                    }
                });
});



