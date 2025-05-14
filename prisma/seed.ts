const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

/*async function main() {

  // Crear usuario de prueba
  const user = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      password: await bcrypt.hash('admin123', 10),
      name: 'Administrador Demo',
      role: 'ADMIN',
    },
  })

  // Crear productos de prueba
  const product1 = await prisma.product.upsert({
    where: { nombre: 'Hamburguesa Vegana' },
    update: {},
    create: {
      nombre: 'Hamburguesa Vegana',
      vegano: true,
      tipo: 'COMIDA_RAPIDA',
      precio: 25000,
      stock: 10,
    },
  })

  const product2 = await prisma.product.upsert({
    where: { nombre: 'Bowl de Quinoa' },
    update: {},
    create: {
      nombre: 'Bowl de Quinoa',
      vegano: true,
      tipo: 'ALMUERZO',
      precio: 18000,
      stock: 15,
    },
  })

  // Pedido de HOY
  const pedidoHoy = await prisma.pedido.create({
    data: {
      userId: user.id,
      fecha: new Date(),
      total: 43000,
    },
  })

  await prisma.itemPedido.createMany({
    data: [
      {
        pedidoId: pedidoHoy.id,
        productoId: product1.id,
        cantidad: 1,
        subtotal: 25000,
      },
      {
        pedidoId: pedidoHoy.id,
        productoId: product2.id,
        cantidad: 1,
        subtotal: 18000,
      },
    ],
  })

  // Pedido hace 3 días
  const fecha3DiasAtras = new Date()
  fecha3DiasAtras.setDate(fecha3DiasAtras.getDate() - 3)

  const pedido7dias = await prisma.pedido.create({
    data: {
      userId: user.id,
      fecha: fecha3DiasAtras,
      total: 50000,
    },
  })

  await prisma.itemPedido.create({
    data: {
      pedidoId: pedido7dias.id,
      productoId: product1.id,
      cantidad: 2,
      subtotal: 50000,
    },
  })

  // Pedido hace 20 días
  const fecha20DiasAtras = new Date()
  fecha20DiasAtras.setDate(fecha20DiasAtras.getDate() - 20)

  const pedido30dias = await prisma.pedido.create({
    data: {
      userId: user.id,
      fecha: fecha20DiasAtras,
      total: 30000,
    },
  })

  await prisma.itemPedido.create({
    data: {
      pedidoId: pedido30dias.id,
      productoId: product2.id,
      cantidad: 2,
      subtotal: 30000,
    },
  }) */
async function main() {

  // Crear productos
  const hamburguesaVegana = await prisma.product.upsert({
    where: { nombre: 'Hamburguesa Vegana' },
    update: {},
    create: {
      nombre: 'Hamburguesa Vegana',
      vegano: true,
      tipo: 'COMIDA_RAPIDA',
      precio: 25000,
      stock: 10,
    },
  });

  const bowlQuinoa = await prisma.product.upsert({
    where: { nombre: 'Bowl de Quinoa' },
    update: {},
    create: {
      nombre: 'Bowl de Quinoa',
      vegano: true,
      tipo: 'ALMUERZO',
      precio: 18000,
      stock: 15,
    },
  });

  // Ingredientes para Hamburguesa Vegana
  const ingredientesHamburguesa = ['Pan Integral', 'Hamburguesa Soya', 'BBQ Vegana', 'Lechuga', 'Tomate'];

  for (const nombre of ingredientesHamburguesa) {
    const ingrediente = await prisma.ingredient.findUnique({ where: { nombre } });
    if (ingrediente) {
      const yaExiste = await prisma.productIngredient.findFirst({
        where: {
          productoId: hamburguesaVegana.id,
          ingredienteId: ingrediente.id,
        },
      });
      if (!yaExiste) {
        await prisma.productIngredient.create({
          data: {
            productoId: hamburguesaVegana.id,
            ingredienteId: ingrediente.id,
          },
        });
        console.log(`✅ Agregado a Hamburguesa Vegana: ${nombre}`);
      }
    } else {
      console.warn(`⚠️ Ingrediente no encontrado: ${nombre}`);
    }
  }

  // Ingredientes para Bowl de Quinoa
  const ingredientesBowl = ['Quinoa', 'Zanahoria', 'Calabacín', 'Brócoli', 'Salsa Tahini'];

  for (const nombre of ingredientesBowl) {
    const ingrediente = await prisma.ingredient.findUnique({ where: { nombre } });
    if (ingrediente) {
      const yaExiste = await prisma.productIngredient.findFirst({
        where: {
          productoId: bowlQuinoa.id,
          ingredienteId: ingrediente.id,
        },
      });
      if (!yaExiste) {
        await prisma.productIngredient.create({
          data: {
            productoId: bowlQuinoa.id,
            ingredienteId: ingrediente.id,
          },
        });
        console.log(`✅ Agregado a Bowl de Quinoa: ${nombre}`);
      }
    } else {
      console.warn(`⚠️ Ingrediente no encontrado: ${nombre}`);
    }
  }

  console.log('✅ Seed ejecutado con éxito');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });