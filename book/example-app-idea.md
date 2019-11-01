# Example App Idea for Svelte Book

Implement a travel planning application.
Is this too complicated?
Maybe you should implemented the whole thing, but
only describe the implementation of parts of it in the book.

Persist data in MongoDB.
Deploy so it is accessible from anywhere including mobile devices.
Consider using Netlify and describing that process in the book.

Make the UI responsive for mobile devices.

## Login

- username
- password
- register
- forgot password

## Profile

- change password

## List Trips

- create trip
- list existing trips
- modify existing trip
- delete existing trip

## Create Trip

- name (for reference in list of trips)
- start date
- end date
- start location
- end location (defaults to start location)

## Activities

examples include sightseeing, theatres, museums, parks,
hiking, and driving to next destination

## Car Rentals

- company
- address
- phone number
- confirmation number
- car type
- rate per day

## Drives

- start location
- end location
- distance in miles or kilometers
- departure time
- expected arrival time
- expected duration

## Flights

- airline
- flight number
- locator id
- departure airport
- departure date/time
- arrival airport
- arrival date/time

Repeat for each connecting flight

## Hotels

- name
- address
- phone number
- website
- confirmation number
- check-in date
- earliest check-in time
- check-out date
- latest check-out time

## Restaurants

- name
- address
- website
- specialties

## Trip Summary

Shows all items above assigned to time ranges on specific days.
Display one column for each day of trip.
Columns are labelled with a date.
Columns contain color coded rectangles that
indicate the start and end time of each item.
Click an item to edit its description or remove it from this view.
Should you support dragging items from a palette onto this view
and dragging them to a different time or day?
