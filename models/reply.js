'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reply extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Articles, {
        foreignKey: 'articleId',
        targetKey: 'articleId'
      })
    }
  }

  Reply.init({
    replyId: {
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    content: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    articleId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Reply',
  });

  return Reply;
};