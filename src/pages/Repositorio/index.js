import React, { useEffect, useState } from 'react';
import {
    Container,
    BackButton,
    Loading,
    Owner,
    FilterList,
    IssuesList,
    PageActions
} from './styles';
// match = descontruir o params para pegar da maneira correta
//match.params.repositorio = repositorio é o nome que defini em routes linha 14 :repositorio

// { decodeURIComponent(match.params.repositorio)}

import api from '../../services/api';
import { FaArrowLeft } from 'react-icons/fa';

export function Repositorio( {match} ){

    const [ repositorio, setRepositorios ] = useState({}); //será objeto
    const [ issues, setIssues ] = useState([]); //aqui como será mais de um, será array
    const [loading, setLoading ] = useState(true);

    const [page, setPage] = useState(1); // 1 = começar na primeira página
    const [filters, setFilters] = useState([
        { state: 'all', label: 'Todas', active: true },
        { state: 'open', label: 'Abertas', active: false },
        { state: 'closed', label: 'Fechadas', active: false },
    ]);
    const [filterIndex, setFilterIndex] = useState(0);


    useEffect( () => {

        async function load(){
            const nomeRepo = decodeURIComponent(match.params.repositorio);

            // um array de promise, vai executar tudo que estiver dentro ao mesmo tempo
            // fará as duas requisições abaixo ao mesmo tempo
            // fará as duas listas, do nomeRepo e dos issues
            const [repositorioData, issuesData] = await Promise.all([
                api.get(`/repos/${nomeRepo}`), // essa será o repositorioData
                api.get(`/repos/${nomeRepo}/issues`, { // essa será o issuesData
                    params: { //forma de paginação
                        // antes estava assim
                        //state: 'open', // virá as de estado aberto
                        
                        //agora ficando de forma dinâmica
                        //find = onde
                        // f = nome opcional
                        //assim estou pegando o que está true, que é o all da linha 27 no state
                        // pois está começando como true por padrão
                        state: filters.find( f => f.active ).state,

                        per_page: 5 //virá de 5 em 5
                    }
                }) 
            ]);
            
            setRepositorios(repositorioData.data); // o .data é onde está as propriedades
            setIssues(issuesData.data);
            setLoading(false);
        };
        load();

    },[ match.params.repositorio ]);


    // useEffect para ver quando a página mudar e renderizar novamente a lista nessa página nova
    useEffect( () => {
        async function loadIssues() {
            const nomeRepo = decodeURIComponent(match.params.repositorio);

            const response = await api.get(`/repos/${nomeRepo}/issues`, {
                params: {
                    //state: 'open', // só os estados open
                    
                    state: filters[filterIndex].state, //pegando o estado desse filterIndex
                    page, // a página que estiver no state
                    per_page: 5,
                },
            });

            setIssues(response.data);
        }

        loadIssues();
        
    },[ filterIndex, filters, match.params.repositorio, page ]); // o importante aqui é o page, sempre que mudar ele chama esse useEffect


    function handlePage(action) { // esse action é o nome que escolhi
        // esse 'back' assim como o 'next' eu mandei lá embaixo juntamente com a função
        // se for back pega a página menos 1, volta uma. se não pega a página + 1, avança para o próxima page
        setPage(action === 'back' ? page - 1 : page + 1 );
    };
    

    function handleFilter(index){
        setFilterIndex(index); //passa para o setFilterIndex o index em que está
        // logo o valor do filterIndex será o index mandado

    }



    if (loading) {
        return (
            <Loading>
                <h1> carregando... </h1>
            </Loading>
        )
    }

    return (
        <Container>

            <BackButton to='/' >
                <FaArrowLeft color='#000' size={20} />
            </BackButton>

            <Owner>
                <img 
                    src={repositorio.owner.avatar_url} 
                    alt={repositorio.owner.login} 
                />

                <h1> {repositorio.name} </h1>
                <p> {repositorio.description} </p> 
            </Owner>


            <FilterList
            // o index passado ali é a posição em que está, 0, 1 ou 2

            //mando como props para estilizar no styles
            //filterIndex começando em 0, vai marcar o botão 'Todas'
            active={filterIndex}
            >
                { filters.map( (filter, index) => (
                    <button
                    type="button"
                    key={filter.label}
                    onClick={ () => handleFilter(index) } //para o função passo o index (qual a posição
                    // em que está )
                    >
                        { filter.label }
                    </button>
                ) ) } 
            </FilterList>


            <IssuesList>

                { issues.map( issue => ( //issue aqui é o nome que escolhi

                    <li key={String(issue.id)}>

                        <img src={issue.user.avatar_url} alt={issue.user.login} />
                        
                        <div>
                            <strong>
                                <a href={issue.html_url} target="_blank"> {issue.title} </a>

                                { issue.labels.map( label => (
                                    <span key={String(label.id)}> {label.name} </span>
                                ))}
                            </strong>

                            <p> {issue.user.login} </p>

                        </div>

                    </li>
                ) ) }

            </IssuesList>

            <PageActions>
            
                <button 
                    type='button' 
                    onClick={ ()=> handlePage('back') }
                    disabled={ page < 2 } //se a page for menor que 2
                >   
                    Voltar
                </button>
                
                <button 
                    type='button' 
                    onClick={ ()=> handlePage('next') }
                >   
                    Próxima
                </button>
            
            </PageActions>
            
        </Container>
    )
}