# mustang-mug
The website, backend, and dashboard for the Mustang Mug Cafe. More information to come. 

## Setup
### Install homebrew
    cd && mkdir homebrew && curl -L https://github.com/Homebrew/brew/tarball/master | tar xz --strip 1 -C homebrew
### Install Node
    brew install node
### Install Firebase Tools
    mkdir ~/.npm-global
    npm config set prefix '~/.npm-global'
After changing your npm prefix, you need to activate it in your bash profile. Open the profile:

    vi ~/.bash_profile
Add the following lines to the file:

    export PATH=~/.npm-global/bin:$PATH
Then reactivate your bash profile:

    . ~/.bash_profile
Now, you can install the firebase tools:

    npm install -g firebase-tools

## Specifications for website from Knight 
- Only open orders up at a certain time for a set amount of time (e.g. open orders at 7:30am until 7:45am)
- Customizable order cap that's enforced (e.g. for 6/3/1982 only allow 20 orders before shutting down order capability)
- Two interfaces: Menu/Ordering and Dashboard/Menu setup (can be split by student workload) 
- Menu section lists all items for sale with prices, user can select items they want and see totals
- Order section first step ensures users has an account with MSB (mySchoolBucks API) -- if they do continue, if they don't bounce them back and provide information on who to contact/how to set up an MSB account
- Dashboard lists any orders that need to processed and allows people working at the cafe to label drinks. Could also set up "text when order is ready" feature
- Menu setup section allows the people using the dashboard to temporarily edit the menu for a specific day
- If success and user has MSB account continue with order, adding to cart, paying etc. This step requires use of 'Pay API' rather than the 'Pay Express'

### Information on MSB is available at the below links: 

- https://www.myschoolbucks.com/ver2/developer/msbpayapi
- https://www.myschoolbucks.com/ver2/developer/home
- https://www.myschoolbucks.com/ver2/developer/swagger/getdocs?apiDocs=msbpayapi


## Hosting ideas
- Front end hosting can be done on repl.it which FCCPS already pays for and most likely will continue to pay for 
- Must ensure backend hosting must be able to easily be maintained and passed onto future students or administrators 
- Ensure continuity of service (students in past years have created things that then become defunct after student leaves or payment stops)

## Current set-up
- Google form that's set up to only be open for a set period of time based on a conference scheduling calendar Chrome extension (tell me this isn't jank af)
- At the end of the day Mustang Mug employee opens up Google Sheet with everyone's schoolbucks information to ensure they have accounts and charge them money, even if they didn't pick up their order 
- Employee manually creates order from form output. 
- Menu is up on a TV physically located near Mustang Mug 

## Benefits of API and order site over a google form
- Saves FCCPS employees work hours and effort to create product
- Streamlines order process and truly ensures products are not over ordered
- Ensures all products ordered can and will be paid for (payment happens prior to reciept of goods) 
