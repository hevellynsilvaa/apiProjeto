'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Post.belongsTo(models.usuarios, {foreignKey: 'userId'})
      // define association here
    }
  }
  Post.init({
    titulo: DataTypes.STRING,
    texto: DataTypes.TEXT,
    foto: DataTypes.STRING,
    userId:{ type: DataTypes.INTEGER, 
      allowNull: false,
        validate:{
          notNull: {msg: 'Nulo não é valido '}
        }
    }
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};