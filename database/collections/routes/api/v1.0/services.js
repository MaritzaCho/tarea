var express = require('express');
var router = express.Router();
var _ = require("underscore");

var Recipe = require("../../../database/collections/recipe");
var Ingredient = require("../../../database/collections/ingredient");



//crear recipe
router.post("/recipes", (req, res) => {
  //Ejemplo de validacion
  if (req.body.name == "" && req.body.descripcion == "") {
    res.status(400).json({
      "msn" : "formato incorrecto"
    });
    return;
  }
  //console.log(req.body.ingredients);return;
  var recipe = {
    name : req.body.name, 
    descripcion : req.body.descripcion,
    ingredients : req.body.ingredients//array
  };
  
  var recipeData = new Recipe(recipe);

  recipeData.save().then( () => {
    //content-type
    res.status(200).json({
      "msn" : "recipe Registrado con exito "
    });
  });
});

//crear ingredients
router.post("/ingredients", (req, res) => {
  //Ejemplo de validacion
  if (req.body.name == "" && req.body.kcal == "" && req.body.peso == "") {
    res.status(400).json({
      "msn" : "formato incorrecto"
    });
    return;
  }
  //console.log(req.body.ingredients);return;
  var ingredient = {
    name : req.body.name, 
    kcal : req.body.kcal,
    peso : req.body.peso
  };
  
  var ingredientData = new Ingredient(ingredient);

  ingredientData.save().then( () => {
    //content-type
    res.status(200).json({
      "msn" : "Ingrediente Registrado con exito "
    });
  });
});
//leer todos recipes
router.get("/recipes", (req, res, next) => {
  Recipe.find({}).exec( (error, docs) => {
    console.log(docs)
    res.status(200).json(docs);
  })
});
//leer ingredients
router.get("/ingredients", (req, res, next) => {
  Ingredient.find({}).exec( (error, docs) => {
    //console.log(docs[0]._id)
    res.status(200).json(docs);
  })
});


// Leer solo un ingredient
router.get(/ingredients\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  Ingredient.findOne({_id : id}).exec( (error, docs) => {
    if (docs != null) {
        res.status(200).json(docs);
        return;
    }

    res.status(200).json({
      "msn" : "No existe el ingrediente"
    });
  })
});
//leer solo una receta
router.get(/recipes\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  console.log(url.split("/"))
  Recipe.findOne({_id : id}).exec( (error, docs) => {
    if (docs != null) {
        res.status(200).json(docs);
        return;
    }

    res.status(200).json({
      "msn" : "No existe la Receta"
    });
  })
});
//eliminar  receta
router.delete(/recipes\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  Recipe.find({_id : id}).remove().exec( (err, docs) => {
      res.status(200).json(docs);
  });
});
//eliminar  ingrediente
router.delete(/ingredients\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  Ingredient.find({_id : id}).remove().exec( (err, docs) => {
      res.status(200).json(docs);
  });
});

//actualizar campos que se envian de la receta (keys)
router.patch(/recipes\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  var keys = Object.keys(req.body);
  var recipe = {};
  for (var i = 0; i < keys.length; i++) {
    recipe[keys[i]] = req.body[keys[i]];
  }
  //console.log(recipe);
  Recipe.findOneAndUpdate({_id: id}, recipe, (err, params) => {
      if(err) {
        res.status(500).json({
          "msn": "Error no se pudo actualizar los datos"
        });
        return;
      }
      res.status(200).json(params);
      return;
  });
});
//actualizar campos que se envian del ingrediente (keys)
router.patch(/ingredients\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  var keys = Object.keys(req.body);
  var ingredient = {};
  for (var i = 0; i < keys.length; i++) {
    ingredient[keys[i]] = req.body[keys[i]];
  }
  //console.log(ingredient);
  Ingredient.findOneAndUpdate({_id: id}, ingredient, (err, params) => {
      if(err) {
        res.status(500).json({
          "msn": "Error no se pudo actualizar los datos"
        });
        return;
      }
      res.status(200).json(params);
      return;
  });
});
//actualizar todos los campos de una receta
router.put(/recipes\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  var keys  = Object.keys(req.body);
  var oficialkeys = ['name', 'descripcion', 'ingredients'];
  var result = _.difference(oficialkeys, keys);
  if (result.length > 0) {
    res.status(400).json({
      "msn" : "Existe un error en el formato de envio puede hacer uso del metodo patch si desea editar solo un fragmentode la informacion"
    });
    return;
  }

  var recipe = {
    name : req.body.name,
    descripcion : req.body.descripcion,
    ingredients : req.body.ingredients
  };
  Recipe.findOneAndUpdate({_id: id}, recipe, (err, params) => {
      if(err) {
        res.status(500).json({
          "msn": "Error no se pudo actualizar los datos"
        });
        return;
      }
      res.status(200).json(params);
      return;
  });
});

//actualizar todos los campos de un ingrediente
router.put(/ingredients\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  var keys  = Object.keys(req.body);
  var oficialkeys = ['name', 'kcal', 'peso'];
  var result = _.difference(oficialkeys, keys);
  if (result.length > 0) {
    res.status(400).json({
      "msn" : "Existe un error en el formato de envio puede hacer uso del metodo patch si desea editar solo un fragmentode la informacion"
    });
    return;
  }

  var ingredient = {
    name : req.body.name, 
    kcal : req.body.kcal,
    peso : req.body.peso
  };
  Ingredient.findOneAndUpdate({_id: id}, ingredient, (err, params) => {
      if(err) {
        res.status(500).json({
          "msn": "Error no se pudo actualizar los datos"
        });
        return;
      }
      res.status(200).json(params);
      return;
  });
});






module.exports = router;
