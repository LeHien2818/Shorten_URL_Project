'use client'
import { useState } from 'react';
import { TextInput, Button, Container, Title, Text, Space } from '@mantine/core';
import classes from './shortener.module.css';

export default function BaseShortUrl() {
    const [url, setUrl] = useState('');
    const [shortenedUrl, setShortenedUrl] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleShorten = async () => {
        if (!url) return;

        try {
            const response = await fetch('http://localhost:3001/shorten/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ originalUrl: url }),
            });

            if (!response.ok) {
                throw new Error('Failed to shorten URL');
            }

            const data = await response.json();
            // console.log(data)
            setShortenedUrl(data.DT.shortUrl);

            setErrorMessage('');
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);  // Set the error message from Error object
            } else {
                setErrorMessage('An unexpected error occurred');
            }
            setShortenedUrl('');
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(shortenedUrl)
            .then(() => alert('Shortened URL copied to clipboard!'))
            .catch(() => alert('Failed to copy URL.'));
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
                {errorMessage && <Text color="red">{errorMessage}</Text>}  {}
                {shortenedUrl && (
                    <div>
                        <Space h="md" />
                        <Text><b>Your shortened URL:</b></Text>
                        <Text
                            component="a"
                            href={shortenedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={classes.shortenedUrl}
                        >
                            {shortenedUrl}
                        </Text>
                        <Space h="md" />
                        <Button onClick={handleCopy} className={classes.button}>Copy</Button>
                    </div>
                )}
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