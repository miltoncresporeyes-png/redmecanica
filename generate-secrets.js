const crypto = require('crypto');

console.log('🔐 Generador de Secrets para Producción\n');
console.log('=========================================\n');

console.log('📝 Copia estos valores en tu archivo .env de producción:\n');

console.log('# JWT Secrets (generados automáticamente)');
const accessSecret = crypto.randomBytes(64).toString('hex');
const refreshSecret = crypto.randomBytes(64).toString('hex');

console.log(`ACCESS_TOKEN_SECRET="${accessSecret}"`);
console.log(`REFRESH_TOKEN_SECRET="${refreshSecret}"`);

console.log('\n⚠️  IMPORTANTE:');
console.log('   - Guarda estos valores en un lugar seguro');
console.log('   - NO los compartas con nadie');
console.log('   - NO los subas a Git');
console.log('   - Usa valores DIFERENTES en desarrollo y producción\n');

console.log('=========================================\n');
console.log('✅ Secrets generados exitosamente!\n');
