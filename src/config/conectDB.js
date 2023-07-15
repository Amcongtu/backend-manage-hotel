import Sequelize from 'sequelize';
import * as tedious from 'tedious';

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('manage_hotel', 'root', null, {
    host: 'localhost',
    dialect: 'mysql' 
  });



const conectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }


}

export default conectDB