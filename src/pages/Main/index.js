import React, { useState, useCallback, useEffect } from 'react';
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa';
import api from '../../services/api';

import { Link } from 'react-router-dom';

import {
    Container,
    Form, 
    SubmitButton,
    List,
    DeleteButton,
    ErrorMsg
} from './styles';

export function Main(){

    const [newRepo, setNewRepo] = useState('');
    const [repositorios, setRepositorios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    // Buscar
    useEffect( () => {
        const repoStorage = localStorage.getItem('repos');

        if (repoStorage){
            //pega o que tem salvo e manda para a state repositorios
            setRepositorios(JSON.parse(repoStorage));
        }

    },[] )
    
    // Salvar alterações
    useEffect( () => {
        localStorage.setItem('repos', JSON.stringify(repositorios));
    
    }, [repositorios])

    function handleInputChange(e){ // e = event
        setNewRepo(e.target.value);
        
        // quando começar digitar algo no input ele tira a borda vermelha ao redor do input
        setAlert(null);
    };

    /*
    async function handleSubmit(e){ //nessa função o type do botão foi definido no styled component dele
        e.preventDefault(); //não da refresh na página quando clicar no botão
        
        const response = await api.get(`repos/${newRepo}`); //newRepo, o que o cara digitou no input
        const data = {
            name: response.data.full_name,
        };

        // ...repositorios = pega o que tem dentro,
        // data = e adiciona o novo
        setRepositorios( [ ...repositorios, data ] );
        setNewRepo('');
    };
    */

    
    //agora com useCallback
    // adicionando repositorio
    const handleSubmit = useCallback( (e) => {
        e.preventDefault(); //para não atualizar a página quando clicar no botão
        async function submit() {
            setLoading(true);
            setAlert(null);
            try {
                if (newRepo === ''){
                    throw new Error('Você precisa indicar um repositório!')
                }
                const response = await api.get(`repos/${newRepo}`); //newRepo, o que o cara digitou no input

                //verificando se já existe um repositório com o nome mandado no input
                const hasRepo = repositorios.find(repo => repo.name === newRepo );
                if (hasRepo) {
                    throw new Error('Repositório já existe!')
                }

                const data = {
                    name: response.data.full_name,
                };
    
                // ...repositorios = pega o que tem dentro,
                // data = e adiciona o novo
                setRepositorios( [ ...repositorios, data ] );
                setNewRepo('');
            } catch (error) {
                setAlert(true); // a partir do momento que eu clicar no botao com o input vazio ele vai ser true,
                // adicionando a borda vermelha em volta definida no style
                console.log(error);
            } finally {
                // quando tudo der certo vem para cá
                setLoading(false);
            }

        }

        submit();

        // quando a state newRepo ou repositorios forem atualizada ele chama esse
        // useCallback
    }, [ newRepo, repositorios ] );

    // deletando repositorio
    const handleDelete = useCallback( (repo) => {
        // r.name está vindo do handleDelete(repo.name) passado no botão
        const find = repositorios.filter( r => r.name !== repo );
        setRepositorios( find );

    }, [repositorios] );

    return (
        <Container>
            <h1>
                <FaGithub size={25} />
                Meus Repositórios
            </h1>

            <Form onSubmit={ handleSubmit } error={alert} >
                <input 
                    type='text' 
                    placeholder='Adicionar Repositório' 
                    value={newRepo}
                    onChange={handleInputChange}
                />

                <SubmitButton loading={ loading ? 1 : 0 } >
                    { loading ? (
                        <FaSpinner color='#FFF' size={14} />
                    ) : (
                        <FaPlus size={14} color='#fff' />
                    ) }
                </SubmitButton>
            </Form>


            <List>
                {
                    repositorios.map( repo => (
                        <li key={ repo.name }>
                            <span> 
                                <DeleteButton onClick={ () => handleDelete(repo.name) }>
                                    <FaTrash size={14} />
                                </DeleteButton>
                                { repo.name } 
                            </span>
                            
                            <Link to={`/repositorio/${ encodeURIComponent(repo.name) }`}
                            // ${ encodeURIComponent(repo.name) } falando que a url para onde vai
                            // é apenas um parâmetro, e não outra página
                            >
                                <FaBars size={20} />
                            </Link>
                        </li>
                    ) )
                }
            </List>

        </Container>
    )
}