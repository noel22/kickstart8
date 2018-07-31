// import an instance of React 
import React from 'react';
import { Container } from 'semantic-ui-react';
import Header from './Header';
import Head from 'next/head'; // everything inside of Head will be moved to head of page

// functional components here get call with 'props'
export default (props) => {
    return (
        <Container>
            <Head>
            <link
                rel="stylesheet"
                href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.1/semantic.min.css">
                </link>
                </Head>
                 
            <Header />
            {props.children}           
        </Container>



    );
    
};