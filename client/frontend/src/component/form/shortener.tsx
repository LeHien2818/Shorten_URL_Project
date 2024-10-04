'use client'
import { useState } from 'react';
import { TextInput, Button, Container, Title, Text, Space } from '@mantine/core';
import classes from './shortener.module.css';

export default function BaseShortUrl() {
    const [url, setUrl] = useState('');
    const [shortenedUrl, setShortenedUrl] = useState('');

    const handleShorten = async () => {
        if (!url) return;
        console.log(url);
        // fetch api

    };

    return (
        <Container size="sm" className={classes.container}>
            <Title className={classes.title}>Short URL</Title>
            <div className={classes.card}>
                <Title order={3} className={classes.cardTitle}>Paste the URL to be shortened</Title>
                <TextInput
                    placeholder="Enter the link here"
                    value={url}
                    onChange={(event) => setUrl(event.currentTarget.value)}
                    className={classes.input}
                />
                <Button onClick={handleShorten} className={classes.button}>Shorten URL</Button>
                <Text className={classes.description}>
                    ShortURL is a free tool to shorten URLs and generate short links. URL shortener allows to create a shortened link making it easy to share.
                </Text>
            </div>
            {/* <div className={classes.premiumCard}>
                <Title order={3} className={classes.cardTitle}>Want More? Try Premium Features!</Title>
                <Text className={classes.premiumDescription}>
                    Custom short links, powerful dashboard, detailed analytics, API, UTM builder, QR codes, browser extension, app integrations and support.
                </Text>
                <Button className={classes.premiumButton}>Create Account</Button>
            </div>
            <Text className={classes.footer}>
                Simple and fast URL shortener!
                <br />
                ShortURL allows to shorten long links from Instagram, Facebook, YouTube, Twitter, LinkedIn and more.
            </Text> */}
        </Container>
    );
}