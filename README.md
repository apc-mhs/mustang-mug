# mustang-mug
The website, backend, and dashboard for the Mustang Mug Cafe. This readme serves chiefly as a contribution guide for GMHS students. If you have a question about a specific issue, please reach out to the individual who created the issue. 

## Table of Contents 
1. [Contribution Guides](#contribution-guides)
2. [Setup](#setup)
   - [Install Homebrew](#install-homebrew)
   - [Install Node](#install-node)
   - [Install Firebase Tools](#install-firebase-tools)
   - [Configure the repoistory](#configure-the-repository)
3. [Selected Documentation](#selected-documentation) 
   - [Design](#design)
   - [Development](#development)
4. [Selected Administration-Sourced Information for Website](#selected-administration-sourced-information-for-website)
   - [Technical Specifications](#technical-specifications)
   - [Current Mustang-Mug Order Procedure](#current-mustang-mug-order-procedure)
   - [Benefits of API and Order Site over a Google Form](#benefits-of-an-api-and-order-site-over-a-google-form)
5. [Project Timeline](#project-timeline)
    
## Contribution Guides 
If you'd like to begin contributing, there are two different pathways to help out, one being design and the other development. Before you begin with either, please read their corresponding guides. 
- [Design Group](https://docs.google.com/document/d/1Li7CFu5svkT2dZMmUMs8T7QXtFuoNox9WiU2pSIEUkg/edit) 
- [Development Group](https://docs.google.com/document/d/11pG9MPToPxX9a-AQYE3q3QMyvRmRDZvPR6uQrVQUTao/edit) 

After reading through your selected guide, please refer to the "Find Work to do" subsection within both of them to begin contributing. 

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
After installation, login to firebase (make sure to use your school google account):

    firebase login
### Configure the repository
In terminal, inside your repository's folder, install dependencies:

    npm install && npm install --prefix functions
Build the necessary hosting files for future runs:

    npm run build
    
## Selected Documentation 
### Design
- [Figma Lessons and Design Exercises](https://www.figma.com/resources/learn-design/)

### Development 
- MySchoolBucks API
    - [MSB Overview](https://www.myschoolbucks.com/ver2/developer/msbpayapi)
    - [MSB Developer Resources](https://www.myschoolbucks.com/ver2/developer/home)
    - [MSB API Documentation](https://www.myschoolbucks.com/ver2/developer/swagger/getdocs?apiDocs=msbpayapi)
- Svelte
    - [Svelte Complete Documentation](https://kit.svelte.dev/docs) 
- Firebase
    - Declan put stuff here

## Selected Administration-Sourced Information for Website
### Technical Specifications 
- Only open orders up at a certain time for a set amount of time (e.g. open orders at 7:30am until 7:45am)
- Customizable order cap that's enforced (e.g. for 6/3/1982 only allow 20 orders before shutting down order capability)
- Two interfaces: Menu/Ordering and Dashboard/Menu setup (can be split by student workload) 
- Menu section lists all items for sale with prices, user can select items they want and see totals
- Order section first step ensures users has an account with MSB (MySchoolBucks API) -- if they do continue, if they don't bounce them back and provide information on who to contact/how to set up an MSB account
- Dashboard lists any orders that need to processed and allows people working at the cafe to label drinks. Could also set up "text when order is ready" feature
- Menu setup section allows the people using the dashboard to temporarily edit the menu for a specific day
- If success and user has MSB account continue with order, adding to cart, paying etc. This step requires use of 'Pay API' rather than the 'Pay Express'

Page graph:
![page graph](resources/readme/page_graph.jpg)


### Current Mustang-Mug Order Procedure
- Google form that's set up to only be open for a set period of time based on a conference scheduling calendar Chrome extension (tell me this isn't jank af)
- At the end of the day Mustang Mug employee opens up Google Sheet with everyone's schoolbucks information to ensure they have accounts and charge them money, even if they didn't pick up their order 
- Employee manually creates order from form output. 
- Menu is up on a TV physically located near Mustang Mug 

### Benefits of an API and Order Site over a Google Form
- Saves FCCPS employees work hours and effort to create product
- Streamlines order process and truly ensures products are not over ordered
- Ensures all products ordered can and will be paid for (payment happens prior to reciept of goods) 

## Project Timeline
![Project Timeline](resources/readme/project_timeline.jpg)
