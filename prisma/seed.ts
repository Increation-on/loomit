// prisma/seed.ts
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
console.log('DATABASE_URL starts with:', process.env.DATABASE_URL?.substring(0, 30))

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!
  })
})

async function main() {
  console.log('🌱 Начинаем сидирование...')

  await prisma.attempt.deleteMany()
  await prisma.question.deleteMany()
  await prisma.quiz.deleteMany()

  const jsQuiz = await prisma.quiz.create({
    data: {
      title: 'Основы JavaScript',
      description: 'Проверьте свои знания основ JavaScript',
       updated_at: new Date(),
      questions: {
        create: [
          {
            text: 'Что выведет console.log(typeof null)?',
            options: [
              { id: '1', text: 'null' },
              { id: '2', text: 'undefined' },
              { id: '3', text: 'object' },
              { id: '4', text: 'number' }
            ],
            correct_option_id: '3',
            order: 1,
            explanation: 'В JavaScript typeof null возвращает "object" - это известная особенность языка.'
          },
          {
            text: 'Какой метод используется для добавления элемента в конец массива?',
            options: [
              { id: '1', text: 'push()' },
              { id: '2', text: 'append()' },
              { id: '3', text: 'addToEnd()' },
              { id: '4', text: 'insert()' }
            ],
            correct_option_id: '1',
            order: 2,
            explanation: 'Метод push() добавляет один или несколько элементов в конец массива.'
          },
          {
            text: 'Что такое Promise в JavaScript?',
            options: [
              { id: '1', text: 'Синхронная функция' },
              { id: '2', text: 'Объект, представляющий завершение или неудачу асинхронной операции' },
              { id: '3', text: 'Тип данных для хранения чисел' },
              { id: '4', text: 'Метод для работы с DOM' }
            ],
            correct_option_id: '2',
            order: 3,
            explanation: 'Promise - это объект, который представляет возможное завершение или неудачу асинхронной операции.'
          },
          {
            text: 'Какая разница между == и === в JavaScript?',
            options: [
              { id: '1', text: '== сравнивает с преобразованием типов, === строгое сравнение' },
              { id: '2', text: '== для чисел, === для строк' },
              { id: '3', text: 'Нет разницы, они идентичны' },
              { id: '4', text: '=== работает только в строгом режиме' }
            ],
            correct_option_id: '1',
            order: 4,
            explanation: '== выполняет приведение типов, === сравнивает без приведения.'
          },
          {
            text: 'Что делает метод map() в массивах?',
            options: [
              { id: '1', text: 'Изменяет исходный массив' },
              { id: '2', text: 'Фильтрует элементы массива' },
              { id: '3', text: 'Создает новый массив, применяя функцию к каждому элементу' },
              { id: '4', text: 'Находит первый подходящий элемент' }
            ],
            correct_option_id: '3',
            order: 5,
            explanation: 'map() создает новый массив с результатами вызова функции для каждого элемента.'
          }
        ]
      }
    }
  })

  const reactQuiz = await prisma.quiz.create({
  data: {
    title: 'React для начинающих',
    description: 'Проверьте знание React: хуки, состояние, жизненный цикл',
     updated_at: new Date(),
    questions: {
      create: [
        {
          text: 'Какой хук используется для управления состоянием?',
          options: [
            { id: '1', text: 'useState' },
            { id: '2', text: 'useEffect' },
            { id: '3', text: 'useContext' },
            { id: '4', text: 'useReducer' }
          ],
          correct_option_id: '1',
          order: 1,
          explanation: 'useState — основной хук для добавления состояния в функциональный компонент.'
        },
        {
          text: 'Какой хук выполняет побочные эффекты?',
          options: [
            { id: '1', text: 'useState' },
            { id: '2', text: 'useEffect' },
            { id: '3', text: 'useCallback' },
            { id: '4', text: 'useMemo' }
          ],
          correct_option_id: '2',
          order: 2,
          explanation: 'useEffect запускает код после рендера: запросы, подписки, таймеры.'
        },
        {
          text: 'Что возвращает useState?',
          options: [
            { id: '1', text: 'Объект с полями state и setState' },
            { id: '2', text: 'Кортеж [значение, функция-сеттер]' },
            { id: '3', text: 'Только значение' },
            { id: '4', text: 'Промис' }
          ],
          correct_option_id: '2',
          order: 3,
          explanation: 'useState возвращает массив из двух элементов: текущее значение и функция для его обновления.'
        }
      ]
    }
  }
})

console.log('✅ Создан демо-квиз:', reactQuiz.title)
console.log('🆔 ID для доступа:', reactQuiz.id)

  console.log('✅ Создан демо-квиз:', jsQuiz.title)
  console.log('🆔 ID для доступа:', jsQuiz.id)
  console.log('📊 Количество вопросов: 5')
}

main()
  .catch((e) => {
    console.error('❌ Ошибка сидирования:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })