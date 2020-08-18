
A few github commands that will be handy for a group project

One time setup:

1. Get the repo 
	- `git clone <repository path>`
2. create & switch to your branch 
	- `git checkout -b <yourname_development>`

Every day routine:

1. check if you are in you are in your branch
	- `git branch`
2. before writing any code pull changes from master
	- `git pull origin master`
3. write code, make commits and push changes to your development branch for the completed task. 
	- `git push origin <yourname_development>`
4. once the feature is completed (no partial code), switch to master 
	- `git checkout master`
5. merge changes to master and resolve merge conflicts:
	- `git merge <yourname_development>`

