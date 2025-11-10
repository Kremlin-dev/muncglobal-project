import sequelize from './src/config/sequelizeConfig.js';

async function addPaymentMethodColumn() {
  try {
    console.log('Adding payment_method column to registrations table...');
    
    await sequelize.query(
      `ALTER TABLE registrations ADD COLUMN payment_method VARCHAR(50) NULL DEFAULT NULL`
    );
    
    console.log('✅ Successfully added payment_method column');
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    if (error.message && error.message.includes('Duplicate column')) {
      console.log('⚠️ Column already exists');
      await sequelize.close();
      process.exit(0);
    }
    console.error('❌ Error adding column:', error.message);
    await sequelize.close();
    process.exit(1);
  }
}

addPaymentMethodColumn();
