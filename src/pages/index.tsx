import React from 'react';
import ChessBoard from '@/components/ChessBoard';
import styles from '@/styles/Home.module.css';

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Chess Game</h1>
        <p>Play chess online</p>
      </header>
      
      <main className={styles.main}>
        <ChessBoard />
      </main>
      
      <footer className={styles.footer}>
        <p>Created with Next.js and chess.js</p>
      </footer>
    </div>
  );
};

export default Home; 