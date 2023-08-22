# Ditty

You probably have a good idea of the top songs and artists you have playing constantly in Spotify, but can you name all your top 10? Better yet, could any of your friends guess them? This game creates a board of your top artists or songs playing in Spotify for you to guess on your own, or share and see if someone else can guess your top ditty.

## Stack

- [Next.js](https://nextjs.org/): A React framework for server-rendered applications.
- [Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework for styling.
- [Spotify Web API](https://developer.spotify.com/documentation/web-api): Integrating with Spotify to access the user's top artists or songs.

## Usage

Sadly Spotify doesn't allow games that use the Spotify API to be made public, that means the Ditty cannot progress from Development mode, so we have 2 options here.

 ### Option 1: Becoming a verified user on my app (Easy)
 
 Essentially, in development mode, I am only allowed to explicitely add up to 25 users to be able to use my app. This means that to test it, just reach out to me with a simple message like
 ```
Hey I am <FULL NAME GOES HERE> and I want to try out Ditty, my email is: <EMAIL ASSOCIATED WITH YOUR SPOTIFY ACCOUNT GOES HERE>
```
And I'll add you to my deployed instance of Ditty :)

 ### Option 2: Run locally
1. Follow the [Spotify documentation to get a Client ID and Client Secret](https://developer.spotify.com/documentation/web-api)
2. Add the following URI to the Redirect URIs in the Dashboard of your app inside Spotify for Developers
```
http://localhost:3000/challenge
```
3. Clone the repository
```
git clone https://github.com/danyalfaro/ditty.git
```
4. Navigate to the project folder
```
cd ditty
```
5. Create new file called .env.local
```
touch .env.local
```
6. Populate the new .env.local file with the following environment variables:
```
NEXT_PUBLIC_CLIENT_ID=<YOUR CLIENT ID GOES HERE>
NEXT_PUBLIC_SECRET=<YOUR CLIENT SECRET GOES HERE>
NEXT_PUBLIC_REDIRECT_TO_CHALLENGE_URI=http://localhost:3000/challenge
NEXT_PUBLIC_DITTY_URL=http://localhost:3000/
NEXT_PUBLIC_CHALLENGE_URI=http://localhost:3000/challenge
```
7. Install dependencies: `npm install`
8. Run the development server: `npm run dev`
9. Open your browser and visit: `http://localhost:3000`
    

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please feel free to create a pull request or open an issue.

## Acknowledgements

- This project was inspired by the love for music and the desire to create an engaging and fun guessing game.

## Contact

For questions or inquiries, please contact [daniel.alfaro@upr.edu](mailto:daniel.alfaro@upr.edum).


The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
