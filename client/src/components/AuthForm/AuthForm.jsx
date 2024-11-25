import { useState } from 'react';
import styles from './AuthForm.module.css';
import { Input, Button, FormControl, FormErrorMessage, Text } from '@chakra-ui/react';
import axiosInstance, { setAccessToken } from '../../axiosInstance';
import { useNavigate } from 'react-router-dom';

export default function AuthForm({ title, type = 'signin', setUser }) {
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const changeHandler = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    let newErrors = {};

    if (!inputs.email) {
      newErrors.email = 'Эл.почта обязательна';
    }

    if (!inputs.password) {
      newErrors.password = 'Пароль обязателен';
    }

    if (type === 'signup' && !inputs.username) {
      newErrors.username = 'Имя пользователя обязательно';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_API_URL}/auth/${type}`,
        inputs
      );
      setUser(response.data.user);
      setAccessToken(response.data.accessToken);
      setServerError('');
      navigate('/');
    } catch (error) {
      if (error.response && error.response.data) {
        setServerError(error.response.data.message);
      } else {
        setServerError('Произошла ошибка. Попробуйте снова.');
      }
    }
  };

  return (
    <form onSubmit={submitHandler} className={styles.wrapper}>
      <h3 className={styles.head}>{title}</h3>
      
      {serverError && (
        <Text color='red.500' mb={4}>
          {serverError}
        </Text>
      )}

      <div className={styles.inputs}>
        {type === 'signin' && (
          <>
            <FormControl isInvalid={errors.email}>
              <Input
                onChange={changeHandler}
                borderColor='#3f3e3e'
                type='email'
                name='email'
                value={inputs?.email || ''}
                placeholder='Эл.почта'
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.password}>
              <Input
                onChange={changeHandler}
                borderColor='#3f3e3e'
                type='password'
                name='password'
                value={inputs?.password || ''}
                placeholder='Пароль'
              />
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>
          </>
        )}
        {type === 'signup' && (
          <>
            <FormControl isInvalid={errors.username}>
              <Input
                onChange={changeHandler}
                borderColor='#3f3e3e'
                name='username'
                value={inputs?.username || ''}
                placeholder='Имя пользователя'
              />
              <FormErrorMessage>{errors.username}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.email}>
              <Input
                onChange={changeHandler}
                borderColor='#3f3e3e'
                type='email'
                name='email'
                value={inputs?.email || ''}
                placeholder='Эл.почта'
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.password}>
              <Input
                onChange={changeHandler}
                borderColor='#3f3e3e'
                type='password'
                name='password'
                value={inputs?.password || ''}
                placeholder='Пароль'
              />
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>
          </>
        )}
      </div>
      
      <div className={styles.btns}>
        <Button type='submit' colorScheme='teal'>
          {type === 'signin' ? 'Вход' : 'Регистрация'}
        </Button>
      </div>
    </form>
  );
}
