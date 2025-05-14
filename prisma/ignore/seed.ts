import { PrismaClient, Prisma, TipoComida } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const getTipoComida = (tipo: string): TipoComida => {
  switch (tipo.toUpperCase()) {
    case 'ALMUERZO':
      return 'ALMUERZO'
    case 'CENA':
      return 'CENA'
    case 'COMIDA_RAPIDA':
      return 'COMIDA_RAPIDA'
    default:
      throw new Error(`Tipo de comida inválido: ${tipo}`)
  }
}

async function main() {
  const passwordHash = bcrypt.hashSync('Test123@', 10)

  // Limpiar registros previos
  await prisma.productIngredient.deleteMany()
  await prisma.product.deleteMany()
  await prisma.ingredient.deleteMany()
  await prisma.user.deleteMany()

  // Crear usuarios
  await prisma.user.createMany({
    data: [
      {
        email: 'admin@gmail.com',
        name: 'Admin User',
        password: passwordHash,
        role: 'ADMIN',
      },
      {
        email: 'client@gmail.com',
        name: 'Client User',
        password: passwordHash,
        role: 'CLIENT',
      },
    ],
  })

  // Aquí irían tus arrays `ingredientes` y `productos` completos
  const ingredientes = [
    { nombre: 'Lechuga', aptoVegano: true, origen: 'Vegetal', tipoAlimento: 'Hortaliza', proveedor: 'AgroCol', lote: 'L001', registro: 'INVIMA-12345', fechaIngreso: '2025-05-01', fechaCaducidad: '2025-05-15' },
    { nombre: 'Tomate', aptoVegano: true, origen: 'Vegetal', tipoAlimento: 'Fruta', proveedor: 'Frutiverde', lote: 'T002', registro: 'INVIMA-12346', fechaIngreso: '2025-05-01', fechaCaducidad: '2025-05-15' },
    { nombre: 'Aceitunas', aptoVegano: true, origen: 'Vegetal', tipoAlimento: 'Fruto Oleaginoso', proveedor: 'GourmetDelSol', lote: 'A003', registro: 'ICA-98765', fechaIngreso: '2025-05-02', fechaCaducidad: '2025-05-30' },
    { nombre: 'Garbanzos', aptoVegano: true, origen: 'Vegetal', tipoAlimento: 'Legumbre', proveedor: 'GranosAndinos', lote: 'G004', registro: 'INVIMA-12347', fechaIngreso: '2025-05-02', fechaCaducidad: '2025-06-30' },
    { nombre: 'Aceite Oliva', aptoVegano: true, origen: 'Vegetal', tipoAlimento: 'Aceite', proveedor: 'ImportOliva', lote: 'AO005', registro: 'ICA-56789', fechaIngreso: '2025-05-03', fechaCaducidad: '2025-08-03' },
    { nombre: 'Pan Integral', aptoVegano: true, origen: 'Procesado', tipoAlimento: 'Panadería', proveedor: 'PanCol', lote: 'PI006', registro: 'INVIMA-12348', fechaIngreso: '2025-05-01', fechaCaducidad: '2025-05-10' },
    { nombre: 'Hamburguesa Soya', aptoVegano: true, origen: 'Procesado', tipoAlimento: 'Proteína Vegana', proveedor: 'VegProCol', lote: 'HS007', registro: 'INVIMA-12349', fechaIngreso: '2025-05-01', fechaCaducidad: '2025-05-15' },
    { nombre: 'BBQ Vegana', aptoVegano: true, origen: 'Procesado', tipoAlimento: 'Salsa', proveedor: 'SalsasVida', lote: 'BV008', registro: 'ICA-67890', fechaIngreso: '2025-05-02', fechaCaducidad: '2025-06-15' },
    { nombre: 'Leche de Coco', aptoVegano: true, origen: 'Vegetal', tipoAlimento: 'Lácteo Vegetal', proveedor: 'TropiFrutas', lote: 'LC009', registro: 'INVIMA-12350', fechaIngreso: '2025-05-01', fechaCaducidad: '2025-06-30' },
    { nombre: 'Arroz Integral', aptoVegano: true, origen: 'Vegetal', tipoAlimento: 'Cereal', proveedor: 'ArrozVita', lote: 'AI010', registro: 'ICA-13579', fechaIngreso: '2025-05-03', fechaCaducidad: '2025-07-15' },
    { nombre: 'Pollo', aptoVegano: false, origen: 'Animal', tipoAlimento: 'Ave', proveedor: 'Carnes La Finca', lote: 'P012', registro: 'INVIMA-22345', fechaIngreso: '2025-05-01', fechaCaducidad: '2025-05-08' },
    { nombre: 'Carne Res', aptoVegano: false, origen: 'Animal', tipoAlimento: 'Res', proveedor: 'Carnes La Sabana', lote: 'CR013', registro: 'INVIMA-22346', fechaIngreso: '2025-05-01', fechaCaducidad: '2025-05-07' },
    { nombre: 'Queso Vegano', aptoVegano: true, origen: 'Procesado', tipoAlimento: 'Sustituto Lácteo', proveedor: 'VegLácteos', lote: 'QV011', registro: 'INVIMA-12351', fechaIngreso: '2025-05-02', fechaCaducidad: '2025-05-30' },
    { nombre: 'Salsa Soya', aptoVegano: true, origen: 'Procesado', tipoAlimento: 'Condimento', proveedor: 'SaboresOriental', lote: 'SS018', registro: 'ICA-11223', fechaIngreso: '2025-05-01', fechaCaducidad: '2025-06-30' },
    { nombre: 'Tofu', aptoVegano: true, origen: 'Procesado', tipoAlimento: 'Proteína Vegana', proveedor: 'VegProCol', lote: 'TF019', registro: 'INVIMA-12353', fechaIngreso: '2025-05-02', fechaCaducidad: '2025-05-30' },
    { nombre: 'Curry', aptoVegano: true, origen: 'Vegetal', tipoAlimento: 'Especia', proveedor: 'EspeciasAndinas', lote: 'CU001', registro: 'INVIMA-56700', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Base Integral', aptoVegano: true, origen: 'Procesado', tipoAlimento: 'Masa', proveedor: 'PanesDelHorno', lote: 'BI002', registro: 'INVIMA-56701', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Albahaca', aptoVegano: true, origen: 'Vegetal', tipoAlimento: 'Hierba', proveedor: 'AromaticasAndinas', lote: 'AL003', registro: 'ICA-56702', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Tortilla Maíz', aptoVegano: true, origen: 'Procesado', tipoAlimento: 'Tortilla', proveedor: 'MaizSabroso', lote: 'TM004', registro: 'INVIMA-56703', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Lentejas', aptoVegano: true, origen: 'Vegetal', tipoAlimento: 'Legumbre', proveedor: 'GranosAndinos', lote: 'LE005', registro: 'INVIMA-56704', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Aguacate', aptoVegano: true, origen: 'Vegetal', tipoAlimento: 'Fruta', proveedor: 'FrutasAndinas', lote: 'AG006', registro: 'INVIMA-56705', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Cebolla', aptoVegano: true, origen: 'Vegetal', tipoAlimento: 'Bulbo', proveedor: 'HortalizasNorte', lote: 'CE007', registro: 'INVIMA-56706', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Quinoa', aptoVegano: true, origen: 'Vegetal', tipoAlimento: 'Cereal', proveedor: 'AndesBio', lote: 'QU008', registro: 'INVIMA-56707', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Zanahoria', aptoVegano: true, origen: 'Vegetal', tipoAlimento: 'Hortaliza', proveedor: 'HortalizasNorte', lote: 'ZA009', registro: 'INVIMA-56708', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Calabacín', aptoVegano: true, origen: 'Vegetal', tipoAlimento: 'Hortaliza', proveedor: 'VerdeCol', lote: 'CA010', registro: 'INVIMA-56709', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Brócoli', aptoVegano: true, origen: 'Vegetal', tipoAlimento: 'Hortaliza', proveedor: 'HortalizasNorte', lote: 'BR011', registro: 'INVIMA-56710', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Salsa Tahini', aptoVegano: true, origen: 'Procesado', tipoAlimento: 'Salsa', proveedor: 'SalsasArabes', lote: 'ST012', registro: 'INVIMA-56711', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Pasta Integral', aptoVegano: true, origen: 'Procesado', tipoAlimento: 'Pasta', proveedor: 'PastasAlDente', lote: 'PI013', registro: 'INVIMA-56712', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Leche Avena', aptoVegano: true, origen: 'Vegetal', tipoAlimento: 'Lácteo Vegetal', proveedor: 'BebidasVerdes', lote: 'LA014', registro: 'INVIMA-56713', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Ajo', aptoVegano: true, origen: 'Vegetal', tipoAlimento: 'Condimento', proveedor: 'AgroCol', lote: 'AJ015', registro: 'INVIMA-56714', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Champiñones', aptoVegano: true, origen: 'Vegetal', tipoAlimento: 'Hongo', proveedor: 'FungiCol', lote: 'CH016', registro: 'INVIMA-56715', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Pan Árabe', aptoVegano: true, origen: 'Procesado', tipoAlimento: 'Panadería', proveedor: 'PanDelicias', lote: 'PA017', registro: 'INVIMA-56716', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Falafel', aptoVegano: true, origen: 'Procesado', tipoAlimento: 'Proteína Vegetal', proveedor: 'VegOriente', lote: 'FA018', registro: 'INVIMA-56717', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Tahini', aptoVegano: true, origen: 'Vegetal', tipoAlimento: 'Salsa', proveedor: 'SalsasArabes', lote: 'TA019', registro: 'INVIMA-56718', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Pepino', aptoVegano: true, origen: 'Vegetal', tipoAlimento: 'Hortaliza', proveedor: 'Frutiverde', lote: 'PE020', registro: 'INVIMA-56719', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Apio', aptoVegano: true, origen: 'Vegetal', tipoAlimento: 'Hortaliza', proveedor: 'HortalizasCentro', lote: 'AP021', registro: 'INVIMA-56720', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Cúrcuma', aptoVegano: true, origen: 'Vegetal', tipoAlimento: 'Especia', proveedor: 'EspeciasAndinas', lote: 'CU022', registro: 'INVIMA-56721', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Arroz', aptoVegano: true, origen: 'Vegetal', tipoAlimento: 'Cereal', proveedor: 'ArrozCol', lote: 'AR023', registro: 'INVIMA-56722', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Cebollín', aptoVegano: true, origen: 'Vegetal', tipoAlimento: 'Hortaliza', proveedor: 'HortalizasNorte', lote: 'CE024', registro: 'INVIMA-56723', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Arroz Blanco', aptoVegano: true, origen: 'Vegetal', tipoAlimento: 'Cereal', proveedor: 'ArrozDelValle', lote: 'AB025', registro: 'INVIMA-56724', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Pan Blanco', aptoVegano: false, origen: 'Procesado', tipoAlimento: 'Panadería', proveedor: 'PanCol', lote: 'PB026', registro: 'INVIMA-56725', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Queso Cheddar', aptoVegano: false, origen: 'Animal', tipoAlimento: 'Lácteo', proveedor: 'LácteosLaVilla', lote: 'QC027', registro: 'INVIMA-56726', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Pasta', aptoVegano: true, origen: 'Procesado', tipoAlimento: 'Harina', proveedor: 'PastasAlDente', lote: 'PA028', registro: 'INVIMA-56727', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Carne Molida', aptoVegano: false, origen: 'Animal', tipoAlimento: 'Res', proveedor: 'Carnes La Finca', lote: 'CM029', registro: 'INVIMA-56728', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Salsa Roja', aptoVegano: true, origen: 'Procesado', tipoAlimento: 'Salsa', proveedor: 'SalsasDelCampo', lote: 'SR030', registro: 'INVIMA-56729', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Queso', aptoVegano: false, origen: 'Animal', tipoAlimento: 'Lácteo', proveedor: 'LácteosDelSur', lote: 'QU031', registro: 'INVIMA-56730', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Orégano', aptoVegano: true, origen: 'Vegetal', tipoAlimento: 'Hierba', proveedor: 'HierbasDelCampo', lote: 'OR032', registro: 'INVIMA-56731', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Pan', aptoVegano: false, origen: 'Procesado', tipoAlimento: 'Panadería', proveedor: 'PanTradición', lote: 'PA033', registro: 'INVIMA-56732', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Salchicha Cerdo', aptoVegano: false, origen: 'Animal', tipoAlimento: 'Cerdo', proveedor: 'EmbutidosCol', lote: 'SC034', registro: 'INVIMA-56733', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Mostaza', aptoVegano: true, origen: 'Vegetal', tipoAlimento: 'Condimento', proveedor: 'SalsasDelCampo', lote: 'MO035', registro: 'INVIMA-56734', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Ketchup', aptoVegano: true, origen: 'Vegetal', tipoAlimento: 'Salsa', proveedor: 'SalsasDelCampo', lote: 'KE036', registro: 'INVIMA-56735', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Pechuga Pollo', aptoVegano: false, origen: 'Animal', tipoAlimento: 'Ave', proveedor: 'CarnesDelCampo', lote: 'PP037', registro: 'INVIMA-56736', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Pan Rallado', aptoVegano: true, origen: 'Procesado', tipoAlimento: 'Panadería', proveedor: 'PanCol', lote: 'PR038', registro: 'INVIMA-56737', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Huevo', aptoVegano: false, origen: 'Animal', tipoAlimento: 'Proteína', proveedor: 'HuevosAndinos', lote: 'HU039', registro: 'INVIMA-56738', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Papa Criolla', aptoVegano: true, origen: 'Vegetal', tipoAlimento: 'Tubérculo', proveedor: 'PapaCol', lote: 'PC040', registro: 'INVIMA-56739', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Papa', aptoVegano: true, origen: 'Vegetal', tipoAlimento: 'Tubérculo', proveedor: 'PapaCol', lote: 'PA041', registro: 'INVIMA-56740', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Crutones', aptoVegano: false, origen: 'Procesado', tipoAlimento: 'Panadería', proveedor: 'PanCol', lote: 'CR042', registro: 'INVIMA-56741', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Queso Parmesano', aptoVegano: false, origen: 'Animal', tipoAlimento: 'Lácteo', proveedor: 'LácteosDelSur', lote: 'QP043', registro: 'INVIMA-56742', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Salsa César', aptoVegano: false, origen: 'Procesado', tipoAlimento: 'Salsa', proveedor: 'SalsasDelCampo', lote: 'SC044', registro: 'INVIMA-56743', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Base Pizza', aptoVegano: true, origen: 'Procesado', tipoAlimento: 'Masa', proveedor: 'PanesDelHorno', lote: 'BP045', registro: 'INVIMA-56744', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Salsa Tomate', aptoVegano: true, origen: 'Vegetal', tipoAlimento: 'Salsa', proveedor: 'SalsasDelCampo', lote: 'ST046', registro: 'INVIMA-56745', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Pepperoni', aptoVegano: false, origen: 'Animal', tipoAlimento: 'Embutido', proveedor: 'EmbutidosCol', lote: 'PE047', registro: 'INVIMA-56746', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Tortilla Trigo', aptoVegano: true, origen: 'Procesado', tipoAlimento: 'Tortilla', proveedor: 'TrigoCol', lote: 'TT048', registro: 'INVIMA-56747', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Fríjoles', aptoVegano: true, origen: 'Vegetal', tipoAlimento: 'Legumbre', proveedor: 'GranosAndinos', lote: 'FR049', registro: 'INVIMA-56748', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Guacamole', aptoVegano: true, origen: 'Procesado', tipoAlimento: 'Salsa', proveedor: 'SalsasMex', lote: 'GU050', registro: 'INVIMA-56749', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Guisantes', aptoVegano: true, origen: 'Vegetal', tipoAlimento: 'Legumbre', proveedor: 'VerdeCol', lote: 'GU051', registro: 'INVIMA-56750', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    { nombre: 'Pimentón', aptoVegano: true, origen: 'Vegetal', tipoAlimento: 'Hortaliza', proveedor: 'HortalizasNorte', lote: 'PI052', registro: 'INVIMA-56751', fechaIngreso: '2025-05-12', fechaCaducidad: '2025-08-30' },
    // Puedes seguir añadiendo los que faltan del catálogo completo...
  ]
  
  const productos = [
  {
    nombre: "Ensalada Mediterránea",
    vegano: true,
    tipo: "ALMUERZO",
    ingredientes: ["Lechuga", "Tomate", "Aceitunas", "Garbanzos", "Aceite Oliva"]
  },
  {
    nombre: "Hamburguesa Vegana BBQ",
    vegano: true,
    tipo: "COMIDA_RAPIDA",
    ingredientes: ["Pan Integral", "Hamburguesa Soya", "BBQ Vegana", "Lechuga", "Tomate"]
  },
  {
    nombre: "Curry de Garbanzos",
    vegano: true,
    tipo: "CENA",
    ingredientes: ["Garbanzos", "Leche de Coco", "Curry", "Arroz Integral"]
  },
  {
    nombre: "Pizza Vegana Napolitana",
    vegano: true,
    tipo: "CENA",
    ingredientes: ["Base Integral", "Tomate", "Queso Vegano", "Albahaca"]
  },
  {
    nombre: "Tacos Veganos de Lentejas",
    vegano: true,
    tipo: "COMIDA_RAPIDA",
    ingredientes: ["Tortilla Maíz", "Lentejas", "Aguacate", "Tomate", "Cebolla"]
  },
  {
    nombre: "Bowl de Quinoa y Verduras",
    vegano: true,
    tipo: "ALMUERZO",
    ingredientes: ["Quinoa", "Zanahoria", "Calabacín", "Brócoli", "Salsa Tahini"]
  },
  {
    nombre: "Pasta Alfredo Vegana",
    vegano: true,
    tipo: "CENA",
    ingredientes: ["Pasta Integral", "Leche Avena", "Ajo", "Champiñones"]
  },
  {
    nombre: "Wrap de Falafel",
    vegano: true,
    tipo: "COMIDA_RAPIDA",
    ingredientes: ["Pan Árabe", "Falafel", "Tahini", "Lechuga", "Pepino"]
  },
  {
    nombre: "Sopa de Lentejas",
    vegano: true,
    tipo: "ALMUERZO",
    ingredientes: ["Lentejas", "Zanahoria", "Apio", "Ajo", "Cúrcuma"]
  },
  {
    nombre: "Arroz Frito Oriental Vegano",
    vegano: true,
    tipo: "CENA",
    ingredientes: ["Arroz", "Tofu", "Cebollín", "Salsa Soya", "Zanahoria"]
  },
  {
    nombre: "Pollo al Curry con Arroz",
    vegano: false,
    tipo: "ALMUERZO",
    ingredientes: ["Pollo", "Curry", "Arroz Blanco", "Leche de Coco"]
  },
  {
    nombre: "Hamburguesa Clásica de Res",
    vegano: false,
    tipo: "COMIDA_RAPIDA",
    ingredientes: ["Pan Blanco", "Carne Res", "Lechuga", "Queso Cheddar", "Tomate"]
  },
  {
    nombre: "Lasaña de Carne",
    vegano: false,
    tipo: "CENA",
    ingredientes: ["Pasta", "Carne Molida", "Salsa Roja", "Queso", "Orégano"]
  },
  {
    nombre: "Hot Dog Tradicional",
    vegano: false,
    tipo: "COMIDA_RAPIDA",
    ingredientes: ["Pan", "Salchicha Cerdo", "Mostaza", "Ketchup", "Cebolla"]
  },
  {
    nombre: "Milanesa de Pollo con Papas",
    vegano: false,
    tipo: "ALMUERZO",
    ingredientes: ["Pechuga Pollo", "Pan Rallado", "Huevo", "Papa Criolla"]
  },
  {
    nombre: "Sopa de Pollo",
    vegano: false,
    tipo: "CENA",
    ingredientes: ["Pollo", "Papa", "Zanahoria", "Cebolla", "Ajo"]
  },
  {
    nombre: "Ensalada César con Pollo",
    vegano: false,
    tipo: "ALMUERZO",
    ingredientes: ["Lechuga", "Pollo", "Crutones", "Queso Parmesano", "Salsa César"]
  },
  {
    nombre: "Pizza de Pepperoni",
    vegano: false,
    tipo: "CENA",
    ingredientes: ["Base Pizza", "Queso", "Salsa Tomate", "Pepperoni"]
  },
  {
    nombre: "Burrito de Carne",
    vegano: false,
    tipo: "COMIDA_RAPIDA",
    ingredientes: ["Tortilla Trigo", "Carne Res", "Fríjoles", "Queso", "Guacamole"]
  },
  {
    nombre: "Arroz con Pollo",
    vegano: false,
    tipo: "ALMUERZO",
    ingredientes: ["Arroz", "Pollo", "Guisantes", "Zanahoria", "Pimentón"]
  }
 ]

  const ingredientesMap = new Map<string, string>()

  for (const i of ingredientes) {
    const created = await prisma.ingredient.create({
      data: {
        nombre: i.nombre,
        aptoVegano: i.aptoVegano,
        origen: i.origen,
        tipoAlimento: i.tipoAlimento,
        proveedor: i.proveedor,
        lote: i.lote,
        registro: i.registro,
        fechaIngreso: new Date(i.fechaIngreso),
        fechaCaducidad: new Date(i.fechaCaducidad),
      },
    })
    ingredientesMap.set(i.nombre, created.id)
  }

  for (const p of productos) {
    const created = await prisma.product.create({
      data: {
        nombre: p.nombre,
        vegano: p.vegano,
        tipo: getTipoComida(p.tipo),
      },
    })

    for (const ing of p.ingredientes) {
      const ingredienteId = ingredientesMap.get(ing)
      if (!ingredienteId) {
        console.warn(`Ingrediente no encontrado: ${ing}`)
        continue
      }

      await prisma.productIngredient.create({
        data: {
          productoId: created.id,
          ingredienteId,
        },
      })
    }
  }

  console.log('✅ Usuarios, ingredientes y productos insertados correctamente.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
