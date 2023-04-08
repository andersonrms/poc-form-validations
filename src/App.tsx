import './styles/global.css';
import { useState } from 'react';
import { useForm } from 'react-hook-form'
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
  email: z.string().nonempty('O e-mail é obrigatório').email('E-mail inválido').toLowerCase().refine(email => {return email.endsWith('@gmail.com')}, 'O e-mail precisa ser do Gmail'),
  password: z.string().min(6, 'A senha preciso de no mínimo 6 caracteres')
})

type CreateUserFormData = z.infer<typeof createUserFormSchema>

function App() {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema)
  })
  const [output, setOutput] = useState('')

  const createUser = (data: any) => {
    setOutput(JSON.stringify(data, null, 2))
  }

  console.log(!!errors.cpf)

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
          {errors.email && <span>{errors.email.message}</span>}
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
          {errors.cpf && <span>{errors.cpf.message}</span>}
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor="email">E-mail</label>
          <input 
            type="email" 
            className='boder border-zinc-600 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white' 
            {...register('email')}
          />
          {errors.email && <span>{errors.email.message}</span>}
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor="password">Senha</label>
          <input 
            type="password" 
            className='boder border-zinc-600 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white' 
            {...register('password')}
            />
            {errors.password && <span>{errors.password.message}</span>}
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
