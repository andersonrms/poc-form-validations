import './styles/global.css';
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { cpfMask } from './helpers/getCpfMaks'

const createUserFormSchema = z.object({
  name: z.string().nonempty('O nome é obrigatório').transform(name => {
    return name.trim().split(' ').map(word => {
      return word[0].toLocaleUpperCase().concat(word.substring(1))
    }).join(' ')
  }),
  cpf: z.string().nonempty('O cpf é obrigatório'),
  email: z.string().nonempty('O e-mail é obrigatório')
    .email('E-mail inválido')
    .toLowerCase()
    .refine(email => {return email.endsWith('@gmail.com')}, 'O e-mail precisa ser do Gmail'),
  password: z.string().min(6, 'A senha preciso de no mínimo 6 caracteres'),
    techs: z.array(z.object({
      title: z.string().nonempty('O título é obrigatório'),
      knowledge: z.coerce.number().min(1).max(100)
  }))
    .min(2, 'Insira pelo menos 2 tecnologias')
    .refine(tech => {
      return tech.some(tech => tech.knowledge > 50) 
    }, 'Você está aprendendo'),
})

type CreateUserFormData = z.infer<typeof createUserFormSchema>

function App() {
  const { register, handleSubmit, formState: { errors }, control } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema)
  })
  const [output, setOutput] = useState('')

  const createUser = (data: CreateUserFormData) => {
    setOutput(JSON.stringify(data, null, 2))
  }

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'techs',
  })

  const addNewTech = () => {
    append({ 
      title: '',
      knowledge: 0
     })
  }

  return (
    <main className='h-screen bg-zinc-950 text-zinc-300 flex flex-col gap-10 items-center justify-center'>
      <form className='flex flex-col gap-4 w-full max-w-xs' onSubmit={handleSubmit(createUser)}>
        <div className='flex flex-col gap-1'>
          <label htmlFor="name">Nome</label>
          <input 
            type="text" 
            className='boder border-zinc-600 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white' 
            {...register('name')}
          />
          {errors.email && <span className='text-red-500 text-sm'>{errors.email.message}</span>}
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor="cpf">CPF</label>
          <input 
            type="text" 
            className='boder border-zinc-600 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white' 
            {...register('cpf', { onChange(event) {
                event.target.value = cpfMask(event.target.value)
            }, })}
          />
          {errors.cpf && <span className='text-red-500 text-sm'>{errors.cpf.message}</span>}
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor="email">E-mail</label>
          <input 
            type="email" 
            className='boder border-zinc-600 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white' 
            {...register('email')}
          />
          {errors.email && <span className='text-red-500 text-sm'>{errors.email.message}</span>}
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor="password">Senha</label>
          <input 
            type="password" 
            className='boder border-zinc-600 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white' 
            {...register('password')}
            />
            {errors.password && <span className='text-red-500 text-sm'>{errors.password.message}</span>}
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor="" className='flex items-center justify-between'>
            Tecnologias
              
            <button 
              className='text-emerald-500 text-sm'
              type='button'
              onClick={addNewTech}
            >
              Adicionar
            </button>
          </label>

          
          {fields.map((field, index) => {
            return (
              <div className='flex gap-2'>
                <div className='flex-1 flex flex-col gap-1'>
                  <input 
                    type="text" 
                    className='boder border-zinc-600 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white' 
                    {...register(`techs.${index}.title`)}
                  />
                  {errors.techs?.[index]?.title && <span className='text-red-500 text-sm'>{errors.techs?.[index]?.title?.message}</span>}
                </div>

                <div className='flex flex-col gap-1'>
                  <input 
                    type="number" 
                    className='w-16 boder border-zinc-600 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white' 
                    {...register(`techs.${index}.knowledge`)}
                  />
                  {errors.techs?.[index]?.knowledge && <span className='text-red-500 text-sm'>{errors.techs?.[index]?.knowledge?.message}</span>}
                </div>
              </div>
            )
          })}
          {errors.techs && <span className='text-red-500 text-sm'>{errors.techs.message}</span>}
        </div>


        <button 
          type="submit"
          className='bg-emerald-500 rounded font-semibold text-white h-10'
        >
          Salvar
        </button>
      </form>
      <pre>{output}</pre>
    </main>
  )
}

export default App
