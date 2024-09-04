# Makefile for React Native Project

# Define useful variables
IOS_DIR := ios
XCODE_PROJECT := $(IOS_DIR)/lets_play.xcworkspace
SCHEME := lets_play

.PHONY: clean-hard
clean-hard:
	@echo "Cleaning Xcode and React Native build artifacts..."
	xcodebuild clean -workspace $(XCODE_PROJECT) -scheme $(SCHEME)
	rm -rf $(IOS_DIR)/build
	rm -rf node_modules/
	rm -rf $(IOS_DIR)/Pods/
	rm -rf $(IOS_DIR)/Podfile.lock
	rm -rf $(IOS_DIR)/DerivedData
	rm -rf android/build
	npx react-native-clean-project

.PHONY: install
install:
	@echo "Installing dependencies..."
	npm install
	cd $(IOS_DIR) && pod install && cd ..

.PHONY: run-ios
run-ios:
	@echo "Running the iOS app..."
	npx react-native run-ios

.PHONY: deploy
deploy:
	@echo "Deploying the iOS app..."
	$(MAKE) install
	$(MAKE) run-ios

.PHONY: pod-install
pod-install:
	@echo "Installing CocoaPods dependencies..."
	cd $(IOS_DIR) && pod install && cd ..

.PHONY: rebuild
rebuild: clean install
	@echo "Rebuilding the project from scratch..."
	$(MAKE) run-ios

.PHONY: reinstall-pod
reinstall-pod: 
	@echo "Rebuilding the project from scratch..."
	cd ios && pod install && cd ..
    npx react-native run-ios
	$(MAKE) run-ios

.PHONY: open-xcode
open-xcode:
	@echo "Opening the Xcode workspace..."
	open $(XCODE_PROJECT)

.PHONY: lint
lint:
	@echo "Running linter..."
	npx eslint .

.PHONY: format
format:
	@echo "Formatting code..."
	npx prettier --write .

.PHONY: start
start:
	@echo "Starting Metro bundler..."
	npx react-native start

.PHONY: reset
reset:
	@echo "Resetting Metro bundler cache..."
	npx react-native start --reset-cache

.PHONY: test
test:
	@echo "Running tests..."
	npm test
.PHONY: clean
simple-clean:
	@echo "Cleaning Xcode build artifacts..."
	xcodebuild clean
	@echo "Installing CocoaPods dependencies..."
	cd ios && pod install && cd ..
	@echo "Running the iOS app..."
	npx react-native run-ios
	