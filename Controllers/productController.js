const Product = require("../Models/Product");
const cloudinary = require("../Config/Cloudinary")

const getProducts = async (req, res) => {
    try {
        const products = await Product.find({})
        res.status(200).json(products)
    } catch (error) {
        return res.status(500).json("internal server error")
    }
}

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById({ _id: req.params.id })
        if (product) {
            res.status(200).json(product)
        }

        else {
            res.status(401).json({ message: "Product not Found " })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json("internal server error" , error)
    }
}

const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;
        let imageUrl;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path)
            console.log(result)
            imageUrl = result.secure_url
        }
        const product = new Product({name, description, stock, price, category, imageUrl})
        const newProduct = await product.save()
        res.status(200).json({ message: "Product created successfully ", newProduct })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error " , error })
    }
}


const updateProduct = async (req, res) => {
    try {
        const { name, description, stock, category, price } = req.body;
        const product = await Product.findById(req.params.id)

        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.stock = stock || product.stock
            product.category = category || product.category

            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path);
                console.log(result)
                product.imageUrl = result.secure_url
            }
        }

        else {
            res.status(401).json({ message: "product not found " })
        }

        const updatedProduct = await product.save()
        res.status(200).json({ message: "product updated successfully ", updatedProduct })


    } catch (error) {
        
        return res.status(500).json({ message: "SERVER ERROR " })

    }
}

const deleteProduct = async (req, res) => {
  try {
      const product = await Product.findById(req.params.id)
    if (product) {
        await Product.deleteOne()
        res.status(200).json({ message: "Product deleted successfully " })
    }
    else {
        res.status(404).json({ message: "product not found " })
    }
  } catch (error) {
       res.status(500).json({ message: "server error " , error })
  }
}

module.exports = { createProduct, getProducts, getProductById, updateProduct , deleteProduct }