"use strict";

var MonsterData = (function() {


    var idsByTag =
{"3d":[639],"ABC":[92],"abduction":[244],"accessories":[563],"accessory":[110,637],"acoustic":[243],"acoustics":[243],"action movie":[324],"actor":[177],"actors":[177],"actress":[177],"actresses":[177],"adhesive":[299],"adhesives":[299],"adventure movie":[324],"agriculture":[102],"alien":[244,244,652],"alternative":[338,343],"amusement park":[151],"android":[420],"animated movie":[324],"apartment":[87],"app":[618],"ar":[639],"art":[201,254],"artist":[254],"artists":[254],"arts":[254],"atm":[63],"atms":[63],"audio":[338,348],"augmented":[639],"babies":[192],"baby":[192],"backpack":[135],"backpacks":[135],"bag":[135,563,653],"baggage":[653],"bags":[135],"bake":[217],"baking":[217],"ball":[226],"bandage":[299],"bandages":[299],"bandaid":[299],"bandaids":[299],"bank":[63],"banking":[63],"banks":[63],"barbecue":[215],"bbq":[215],"bicycle":[492],"bicycles":[492],"bike":[492],"bikes":[492],"biking":[492],"bill":[405],"birthday":[217],"birthdays":[217],"blade":[594],"blades":[594],"blender":[221,278],"blenders":[278],"blocks":[92],"blues":[338],"boardwalk":[151],"book":[48],"books":[48],"boombox":[355],"boomboxes":[355],"bottle":[218],"bouquet":[274],"bouquets":[274],"breezy":[282],"briefcase":[89],"briefcases":[89],"buggy":[477],"business":[63],"button":[618],"buy":[477],"buying":[477],"cake":[217],"cakes":[217],"camcorder":[633],"camera":[281,633],"cameras":[281],"can":[86],"canine":[425],"canvas":[589],"car":[6,8],"cardiovascular":[286],"career":[89],"careers":[89],"carrot":[229],"carrots":[229],"carryout":[210],"cars":[6,6,8],"cart":[477],"ceiling":[282],"ceiling fan":[282],"ceiling fans":[282],"ceilings":[282],"chai":[222],"channel":[640],"charcoal":[215],"check out":[477],"cherry":[218],"chest":[283],"chest of drawers":[283],"chests":[283,283],"child":[92,192,224],"childhood education":[92],"children":[92,192,224],"children movie":[324],"chord":[243],"chords":[243],"cinema":[324],"clapboard":[324],"clapperboard":[324],"class":[135],"classes":[135],"classic car":[8],"classical":[338],"cleaning":[479],"coffee":[220],"coins":[95],"collar":[425],"collars":[425],"college":[135],"colleges":[135],"color":[201],"comedy":[338,348],"comedy movie":[324],"communication":[420],"computer":[599,632],"computers":[599],"computing":[599],"console game":[681],"controller":[681],"convertable":[8],"converter":[110],"cook":[216],"cooking":[215,216],"cookout":[215],"country":[338],"craft":[254],"crafts":[254],"crying":[192],"cucumber":[229],"cucumbers":[229],"cup":[220],"cycle":[492],"cycling":[492],"dad":[192],"dancing":[158],"data":[618,637],"daycare":[92],"debt":[405],"decorating":[280],"degree":[135],"degrees":[135],"deliveries":[210],"delivery":[210],"dessert":[217],"desserts":[217],"diet":[231],"dining":[218],"dinner":[218],"director":[324],"disco":[158],"disease":[286],"diseases":[286],"doctor":[286],"doctors":[286],"documentary":[324],"dog":[425],"doghouse":[425],"dogs":[425],"dollar":[405],"drama":[93,324],"dramas":[324],"drawer":[283],"drawers":[283],"drink":[222],"eating":[221],"education":[92,132],"educations":[132],"egg":[229],"electricity":[110],"electronics":[278,355,632,633],"elementary":[92],"enchantment":[241],"encore":[177],"energy":[86,110],"entertain":[279],"episode":[640],"exercise":[226],"eye protection":[294],"eyeglasses":[294],"fair":[151],"families":[192],"family":[192],"fan":[282],"fans":[282],"farm":[102],"fashion":[294,563,589,637],"father":[192],"fiction":[48],"fidget":[482],"fidget spinner":[482],"fidgets":[482],"film":[324],"finance":[63,405,410],"finances":[410],"fine art":[201],"first aid":[299],"fit":[637],"fitness":[226],"flight":[653],"flower":[274],"flowers":[274],"food":[102,210,220,221,229],"food movements":[220],"foods":[229],"frames":[294],"fuel":[86,86,110],"furniture":[279,283],"furnitures":[283],"game":[269,681],"games":[269],"gaming":[681],"garden":[274],"gardening":[274],"gardens":[274],"gas":[86],"gas can":[86],"grill":[215],"grills":[215],"groceries":[477],"guitar":[243],"guitars":[243],"handbag":[563],"headphones":[338,348],"health":[224,229,231,286,299,637],"healthy":[221,229,231],"heart":[286],"heat":[216],"herbal":[222],"herbie fully loaded":[8],"herbs":[234],"hiphop":[355],"hobbies":[269],"hobby":[269],"holiday":[478],"home":[87,282,283,479],"home appliance":[278],"home appliances":[278],"home improvement":[280,282],"home security":[281],"homes":[282,283],"homework":[132],"horror movie":[324],"hot":[222],"hot dogs":[215],"house":[87,479],"hoverboard":[516],"illusion":[241],"imagination":[48],"improvements":[282],"info":[618],"injuries":[299],"injury":[299],"inline":[516],"instrument":[243],"interior":[283],"intermission":[177],"investment":[410],"investments":[410],"iphone":[420],"italy":[210],"jazz":[338],"jigsaw":[269],"jigsaws":[269],"job":[89],"job search":[89],"job searches":[89],"jobs":[89],"key":[443],"kid":[192],"kids":[192],"kindergarten":[92],"kitchen":[278],"kitchens":[278],"laces":[589],"lamp":[256],"landline":[420],"laptop":[599],"laptops":[599],"lenses":[294],"letters":[92],"lifestyle":[231],"literature":[48],"location":[655],"luggage":[653],"magic":[241],"magic man":[241],"magician":[241],"market":[87],"masks":[93],"meal":[229],"meals":[229],"meat":[215],"medical":[286],"medicine":[286,299],"medicines":[286],"mens":[589],"microwave":[216],"mom":[192],"money":[63,95,405,410],"mother":[192],"mouse":[632],"movie":[324],"movie theater":[324],"movie theatre":[324],"movies":[324],"mtb":[492],"music":[243,338,343,348,355,362],"nightclub":[158],"nightclubs":[158],"nintendo":[681],"non-alcoholic":[222],"nutrition":[229],"occupation":[89],"occupations":[89],"oil":[86],"old phone":[420],"oldsmobile":[8],"opera":[93],"order":[210],"out":[218],"pacifier":[192],"paint":[201,254],"paintbrush":[254],"paintbrushes":[254],"painting":[201,254],"paintings":[254],"paints":[254],"palette":[201],"paper":[478],"paranormal":[244],"parent":[192],"parents":[192],"participation":[226],"parties":[158],"party":[158,279],"payment":[63],"payments":[63],"pencil":[132],"pencils":[132],"peripheral":[632],"personal finance":[410],"personal finances":[410],"personal investing":[410],"pet":[425],"pet care":[425],"pets":[425],"phone":[420],"phone services":[420],"phones":[420],"piggy bank":[95],"pizza":[210],"pizzas":[210],"plane":[655],"plant":[274],"plants":[274],"plate":[229],"plates":[229],"play":[269],"plays":[93,269],"plug":[110],"podcast":[338,348],"polarized":[294],"pot":[274],"pounds":[231],"preschool":[92],"propane":[215],"property":[443],"puppy":[425],"purse":[563],"puzzle":[269,269],"rabbit":[241],"radio":[355],"radios":[355],"rainbow":[217],"rap":[338],"Ray-Ban":[294],"razor":[594],"razors":[594],"realtor":[87],"realty":[87],"record":[343],"recordplayer":[343],"rectal probe":[244],"red carpet":[177],"rental":[443],"retail":[443,477],"ribs":[215],"riddle":[269],"riddles":[269],"ride":[151],"rockstar":[243],"rockstars":[243],"roller coaster":[151],"root":[274],"roots":[274],"rotary phone":[420],"saving":[410],"savings":[95],"sax":[362],"saxophone":[362],"school":[92,132,135],"school supplies":[132],"schools":[92,132],"science fiction":[652],"science fiction movie":[324],"scrapbook":[256],"scraped":[299],"securities":[281],"security":[281,618],"shave":[594],"shaving":[594],"shoe":[589],"shoes":[589],"shop":[477,478],"shopping":[477,478,479],"sit and spin":[224],"skate":[516],"slip-on":[589],"smartphone":[420],"smoothie":[221],"soap opera":[324],"soccer":[226],"soda":[218],"song":[338],"songs":[338],"sorcery":[241],"spaceship":[244],"spin":[224,482],"spinner":[482],"sport":[637],"sports utility vehicle":[6],"stethoscope":[286],"stethoscopes":[286],"streamers":[492],"strings":[243],"suitcase":[653],"sun":[294],"sunglasses":[294],"supplies":[479],"surveillance":[281],"surveillance camera":[281],"surveillance cameras":[281],"surveillances":[281],"suv":[6],"suvs":[6],"switch":[681],"table":[279],"tea":[222,234],"teapot":[222],"teapots":[222],"teas":[222],"tech":[633],"technology":[633],"telecommunications":[420],"telephone":[420],"telephones":[420],"televeision":[640],"televisions":[640],"theater":[93,177],"theaters":[177],"theatre":[177],"theatres":[177],"thermos":[220],"tongs":[215],"toy":[224,482],"toys":[224,482],"tractor":[102],"travel":[110,653,655],"tv":[640],"tvs":[640],"twilight zone":[652],"typing":[599],"ufo":[244],"universities":[135],"university":[135],"utility":[6],"vans":[589],"vegetable":[229],"vegetables":[229],"veggies":[229],"vehicle":[6,8],"vehicles":[6,8],"video":[681],"video game":[681],"vintage":[8],"virtual":[639],"Volkswagen bug":[8],"vr":[639],"watch":[637],"weed":[274],"weeds":[274],"weight":[231],"weight loss":[231],"wellness":[234],"window":[280],"windows":[280],"wizardry":[241],"women's fashion":[563],"woof":[425],"work":[89],"wrap":[478],"wrapping":[478],"writing":[132]}
;


var dataById =
{"6":{"mid":"6","parent":"2","name":"SUV","slug":"6-suv","tier1":"Automotive","tier2":"Auto Body Styles","tier3":"SUV","tier4":"","creator":"Owen Mundy","object":"glittery suv","frames":"3","facing":"-1","tags":"car,cars,suv,sports utility vehicle,utility, cars, suvs, vehicles, vehicle","notes":""},"8":{"mid":"8","parent":"2","name":"Convertible","slug":"8-convertible","tier1":"Automotive","tier2":"Auto Body Styles","tier3":"Convertible","tier4":"","creator":"Lindsey Owen","object":"old style green convertable","frames":"6","facing":"-1","tags":"car, cars, convertable, vintage, oldsmobile, vehicle, vehicles, classic car, Volkswagen bug, herbie fully loaded","notes":""},"48":{"mid":"48","parent":"42","name":"Fiction","slug":"48-fiction","tier1":"Books and Literature","tier2":"Fiction","tier3":"","tier4":"","creator":"Lauren Crane","object":"flying book","frames":"3","facing":"-1","tags":"literature, book, imagination, fiction, books","notes":""},"63":{"mid":"63","parent":"53","name":"Business Banking & Finance","slug":"63-business-banking-finance","tier1":"Business and Finance","tier2":"Business","tier3":"Business Banking & Finance","tier4":"","creator":"Owen Mundy","object":"atm","frames":"3","facing":"-1","tags":"finance,banking,atm,business, money, payment, bank, banks, atms, payments","notes":""},"86":{"mid":"86","parent":"80","name":"Gasoline Prices","slug":"86-gasoline-prices","tier1":"Business and Finance","tier2":"Economy","tier3":"Gasoline Prices","tier4":"","creator":"Mike Bauman","object":"sneezing gas can","frames":"4","facing":"1","tags":"gas,can,fuel,energy, oil, fuel, gas can","notes":""},"87":{"mid":"87","parent":"80","name":"Housing Market","slug":"87-housing-market","tier1":"Business and Finance","tier2":"Economy","tier3":"Housing Market","tier4":"","creator":"Joelle Dietrick","object":"dino house","frames":"","facing":"1","tags":"house, market, apartment, home, realty, realtor","notes":""},"89":{"mid":"89","parent":"80","name":"Job Market","slug":"89-job-market","tier1":"Business and Finance","tier2":"Economy","tier3":"Job Market","tier4":"","creator":"Lauren Crane","object":"briefcase","frames":"","facing":"-1","tags":"career, jobs, briefcase, job search, occupation, occupations, job, careers, job searches, briefcases, work","notes":""},"92":{"mid":"92","parent":"90","name":"Education industry","slug":"92-education-industry","tier1":"Business and Finance","tier2":"Industries","tier3":"Education industry","tier4":"","creator":"Katie Im","object":"alphabet blocks","frames":"","facing":"0","tags":"education, children, blocks, letters, ABC, preschool, childhood education, daycare, elementary, kindergarten, school, child, schools","notes":""},"93":{"mid":"93","parent":"90","name":"Entertainment Industry","slug":"93-entertainment-industry","tier1":"Business and Finance","tier2":"Industries","tier3":"Entertainment Industry","tier4":"","creator":"Katie Im","object":"yellow and blue theater masks","frames":"","facing":"0","tags":"theater, masks, opera, drama, plays","notes":""},"95":{"mid":"95","parent":"90","name":"Financial Industry","slug":"95-financial-industry","tier1":"Business and Finance","tier2":"Industries","tier3":"Financial Industry","tier4":"","creator":"Mike Bauman","object":"piggy bank with bulging eyes","frames":"","facing":"1","tags":"money, piggy bank, savings, coins","notes":""},"102":{"mid":"102","parent":"90","name":"Agriculture","slug":"102-agriculture","tier1":"Business and Finance","tier2":"Industries","tier3":"Agriculture","tier4":"","creator":"Katie Im","object":"tractor","frames":"","facing":"1","tags":"tractor,farm,agriculture,food","notes":""},"110":{"mid":"110","parent":"90","name":"Power and Energy Industry","slug":"110-power-and-energy-industry","tier1":"Business and Finance","tier2":"Industries","tier3":"Power and Energy Industry","tier4":"","creator":"Joelle Dietrick","object":"plug","frames":"","facing":"1","tags":"plug, fuel, energy, electricity, travel, accessory, converter","notes":""},"132":{"mid":"132","parent":"","name":"Education","slug":"132-education","tier1":"Education","tier2":"","tier3":"","tier4":"","creator":"Mike Bauman","object":"yellow jumping pencils","frames":"","facing":"0","tags":"pencils, writing, education, school, homework, school supplies, pencil, educations, schools","notes":""},"135":{"mid":"135","parent":"132","name":"Secondary Education","slug":"135-secondary-education","tier1":"Education","tier2":"Secondary Education","tier3":"","tier4":"","creator":"Allyson Taylor","object":"backpack","frames":"","facing":"0","tags":"backpack, backpacks, school, bag, class, classes, college, university, degree, colleges, universities, degrees, bags","notes":""},"151":{"mid":"151","parent":"150","name":"Amusement and Theme Parks","slug":"151-amusement-and-theme-parks","tier1":"Events and Attractions","tier2":"Amusement and Theme Parks","tier3":"","tier4":"","creator":"Lauren Crane","object":"rollercoaster with tongue","frames":"","facing":"0","tags":"amusement park, roller coaster, ride, fair, boardwalk","notes":""},"158":{"mid":"158","parent":"150","name":"Nightclubs","slug":"158-nightclubs","tier1":"Events and Attractions","tier2":"Nightclubs","tier3":"","tier4":"","creator":"Owen Mundy","object":"disco ball with teeth (backup disco ball by Allyson Taylor)","frames":"","facing":"0","tags":"disco,dancing,nightclub,nightclubs,party,parties","notes":""},"177":{"mid":"177","parent":"150","name":"Theater Venues and Events","slug":"177-theater-venues-and-events","tier1":"Events and Attractions","tier2":"Theater Venues and Events","tier3":"","tier4":"","creator":"Owen Mundy","object":"monster with ropes for arms","frames":"","facing":"0","tags":"theater, theaters, theatre, theatres, actor, actress, actresses, actors, red carpet, encore, intermission","notes":""},"192":{"mid":"192","parent":"186","name":"Parenting","slug":"192-parenting","tier1":"Family and Relationships","tier2":"Parenting","tier3":"","tier4":"","creator":"Lauren Crane","object":"baby pacifier","frames":"","facing":"-1","tags":"family, kids, baby, child, parent, pacifier, crying, families, kid, babies, children, parents, mother, father, mom, dad","notes":""},"201":{"mid":"201","parent":"","name":"Fine Art","slug":"201-fine-art","tier1":"Fine Art","tier2":"","tier3":"","tier4":"","creator":"Coco Peng","object":"painting palette","frames":"","facing":"1","tags":"fine art,art,paint,painting,palette,color","notes":""},"210":{"mid":"210","parent":"","name":"Food & Drink","slug":"210-food-drink","tier1":"Food & Drink","tier2":"","tier3":"","tier4":"","creator":"Izzy Swearingen","object":"colorful pizza with polka dots","frames":"","facing":"-1","tags":"pizza, food, italy, order, carryout, delivery, pizzas, deliveries","notes":""},"215":{"mid":"215","parent":"210","name":"Barbecues and Grilling","slug":"215-barbecues-and-grilling","tier1":"Food & Drink","tier2":"Barbecues and Grilling","tier3":"","tier4":"","creator":"Katie Im","object":"grill with flames!!","frames":"","facing":"0","tags":"grill,cooking,cookout,grills,bbq,barbecue,hot dogs,ribs,meat,propane,tongs,charcoal","notes":""},"216":{"mid":"216","parent":"210","name":"Cooking","slug":"216-cooking","tier1":"Food & Drink","tier2":"Cooking","tier3":"","tier4":"","creator":"Berry Boeckman","object":"216 microwave","frames":"5","facing":"-1","tags":"microwave,cook,heat,cooking","notes":""},"217":{"mid":"217","parent":"210","name":"Desserts and Baking","slug":"217-desserts-and-baking","tier1":"Food & Drink","tier2":"Desserts and Baking","tier3":"","tier4":"","creator":"Joelle Dietrick","object":"217-cake","frames":"","facing":"1","tags":"cake,dessert,baking,rainbow,birthday, birthdays, cakes, desserts, bake","notes":""},"218":{"mid":"218","parent":"210","name":"Dining Out","slug":"218-dining-out","tier1":"Food & Drink","tier2":"Dining Out","tier3":"","tier4":"","creator":"John Crawford","object":"218-dining-out","frames":"","facing":"0","tags":"bottle,cherry,soda,dining,dinner,out","notes":""},"220":{"mid":"220","parent":"210","name":"Food Movements","slug":"220-food-movements","tier1":"Food & Drink","tier2":"Food Movements","tier3":"","tier4":"","creator":"Mila Loneman","object":"220 coffee cup","frames":"","facing":"0","tags":"coffee,food, food movements,cup, thermos","notes":""},"221":{"mid":"221","parent":"210","name":"Healthy Cooking and Eating","slug":"221-healthy-cooking-and-eating","tier1":"Food & Drink","tier2":"Healthy Cooking and Eating","tier3":"","tier4":"","creator":"Berry Boeckman","object":"221 blender","frames":"6","facing":"1","tags":"blender,smoothie,healthy,food,eating","notes":""},"222":{"mid":"222","parent":"210","name":"Non-Alcoholic Beverages","slug":"222-non-alcoholic-beverages","tier1":"Food & Drink","tier2":"Non-Alcoholic Beverages","tier3":"","tier4":"","creator":"Chloe Pitkoff","object":"teapot","frames":"","facing":"0","tags":"teapot,tea,chai, hot, non-alcoholic, drink, herbal, teapots, teas","notes":""},"224":{"mid":"224","parent":"223","name":"Children's Health","slug":"224-childrens-health","tier1":"Healthy Living","tier2":"Children's Health","tier3":"","tier4":"","creator":"Joelle Dietrick","object":"sit and spin","frames":"","facing":"0","tags":"toys, child, health, sit and spin, spin, children, toy","notes":""},"226":{"mid":"226","parent":"225","name":"Participant Sports","slug":"226-participant-sports","tier1":"Healthy Living","tier2":"Fitness and Exercise","tier3":"Participant Sports","tier4":"","creator":"Mike Bauman","object":"soccer ball","frames":"","facing":"0","tags":"ball,soccer,fitness,exercise,participation","notes":""},"229":{"mid":"229","parent":"223","name":"Nutrition","slug":"229-nutrition","tier1":"Healthy Living","tier2":"Nutrition","tier3":"","tier4":"","creator":"Mike Bauman","object":"dancing plate of veggies","frames":"","facing":"-1","tags":"health, healthy, vegetables, veggies, plate, food, nutrition, foods, plates, vegetable, carrot, carrots, cucumber, cucumbers, meal, meals, egg","notes":""},"231":{"mid":"231","parent":"223","name":"Weight Loss","slug":"231-weight-loss","tier1":"Healthy Living","tier2":"Weight Loss","tier3":"","tier4":"","creator":"Lauren Crane","object":"weight scale being squeezed by measuring tape","frames":"","facing":"0","tags":"weight, weight loss, health, diet, pounds, lifestyle, healthy","notes":""},"234":{"mid":"234","parent":"233","name":"Herbs and Supplements","slug":"234-herbs-and-supplements","tier1":"Healthy Living","tier2":"Wellness","tier3":"Alternative Medicine","tier4":"Herbs and Supplements","creator":"Coco Peng","object":"teapot (a stretch but couldn't find home —Joelle)","frames":"","facing":"-1","tags":"tea,herbs,wellness","notes":""},"241":{"mid":"241","parent":"239","name":"Magic and Illusion","slug":"241-magic-and-illusion","tier1":"Hobbies & Interests","tier2":"Magic and Illusion","tier3":"","tier4":"","creator":"Lindsey Owen","object":"Rabbit and Hat Magic!","frames":"","facing":"1","tags":"magic, rabbit, illusion, sorcery, wizardry, magician, magic man, enchantment","notes":""},"243":{"mid":"243","parent":"239","name":"Musical Instruments","slug":"243-musical-instruments","tier1":"Hobbies & Interests","tier2":"Musical Instruments","tier3":"","tier4":"","creator":"Mike Bauman","object":"dancing guitar","frames":"","facing":"0","tags":"music, guitar, instrument, strings, rockstar, acoustic, chords, chord, rockstars, guitars, acoustics","notes":""},"244":{"mid":"244","parent":"239","name":"Paranormal Phenomena","slug":"244-paranormal-phenomena","tier1":"Hobbies & Interests","tier2":"Paranormal Phenomena","tier3":"","tier4":"","creator":"Katie Im","object":"UFO","frames":"","facing":"0","tags":"ufo,paranormal,alien,alien,abduction,spaceship,rectal probe","notes":""},"254":{"mid":"254","parent":"248","name":"Painting","slug":"254-painting","tier1":"Hobbies & Interests","tier2":"Arts and Crafts","tier3":"Painting","tier4":"","creator":"Chloe Pitkoff","object":"paintbrush","frames":"","facing":"0","tags":"paints, paintbrushes, paintings, arts, artists, crafts, paint, paintbrush, painting, art, artist, craft","notes":""},"256":{"mid":"256","parent":"248","name":"Scrapbooking","slug":"256-scrapbooking","tier1":"Hobbies & Interests","tier2":"Arts and Crafts","tier3":"Scrapbooking","tier4":"","creator":"Berry Boeckman","object":"256 lamp (bit of stretch but no other match —Joelle)","frames":"","facing":"0","tags":"lamp, scrapbook","notes":"needs sprite sheet and PSD"},"269":{"mid":"269","parent":"239","name":"Games and Puzzles","slug":"269-games-and-puzzles","tier1":"Hobbies & Interests","tier2":"Games and Puzzles","tier3":"","tier4":"","creator":"Lauren Crane","object":"three moving puzzle pieces","frames":"4","facing":"0","tags":"game, puzzle, hobby, jigsaw, play, riddle, games, puzzle, hobbies, jigsaws, plays, riddles","notes":""},"274":{"mid":"274","parent":"","name":"Home & Garden","slug":"274-home-garden","tier1":"Home & Garden","tier2":"","tier3":"","tier4":"","creator":"Mike Bauman","object":"flower in a pot","frames":"","facing":"0","tags":"flower, bouquet, pot, root, gardening, garden, gardens, weeds, weed, roots, flowers, bouquets, plant, plants","notes":""},"278":{"mid":"278","parent":"274","name":"Home Appliances","slug":"278-home-appliances","tier1":"Home & Garden","tier2":"Home Appliances","tier3":"","tier4":"","creator":"Owen Mundy","object":"a blender with eyeballs","frames":"","facing":"0","tags":"blender,kitchen,electronics,home appliances, blenders, kitchens, home appliance","notes":""},"279":{"mid":"279","parent":"274","name":"Home Entertaining","slug":"279-home-entertaining","tier1":"Home & Garden","tier2":"Home Entertaining","tier3":"","tier4":"","creator":"Joelle Dietrick","object":"ikea tables stacked","frames":"","facing":"0","tags":"table,party,entertain,furniture","notes":""},"280":{"mid":"280","parent":"274","name":"Home Improvement","slug":"280-home-improvement","tier1":"Home & Garden","tier2":"Home Improvement","tier3":"","tier4":"","creator":"Joelle Dietrick","object":"280 window with tentacles","frames":"","facing":"1","tags":"decorating, window, home improvement, windows","notes":""},"281":{"mid":"281","parent":"274","name":"Home Security","slug":"281-home-security","tier1":"Home & Garden","tier2":"Home Security","tier3":"","tier4":"","creator":"Joelle Dietrick","object":"281-surveillance-camera","frames":"","facing":"-1","tags":"home security, security, surveillance, securities, surveillances, cameras, surveillance camera, camera, surveillance cameras","notes":""},"282":{"mid":"282","parent":"274","name":"Indoor Environmental Quality","slug":"282-indoor-environmental-quality","tier1":"Home & Garden","tier2":"Indoor Environmental Quality","tier3":"","tier4":"","creator":"Joelle Dietrick","object":"282-ceiling-fan","frames":"","facing":"0","tags":"home, home improvement, ceiling, fan, ceiling fan, ceilings, fans, ceiling fans, homes, improvements, breezy","notes":""},"283":{"mid":"283","parent":"274","name":"Interior Decorating","slug":"283-interior-decorating","tier1":"Home & Garden","tier2":"Interior Decorating","tier3":"","tier4":"","creator":"Joelle Dietrick","object":"283-furniture-chest","frames":"","facing":"1","tags":"furniture, chest, drawers, interior, home, drawer, chests, homes, furnitures, chests, chest of drawers","notes":""},"286":{"mid":"286","parent":"","name":"Medical Health","slug":"286-medical-health","tier1":"Medical Health","tier2":"","tier3":"","tier4":"","creator":"Lauren Crane","object":"stethoscope squeezing a heart","frames":"","facing":"0","tags":"health, medical, medicine, doctor, disease, diseases, stethoscope, stethoscopes, doctors, medicines, cardiovascular, heart","notes":""},"294":{"mid":"294","parent":"287","name":"Eye and Vision Conditions","slug":"294-eye-and-vision-conditions","tier1":"Medical Health","tier2":"Diseases and Conditions","tier3":"Eye and Vision Conditions","tier4":"","creator":"Chloe Pitkoff","object":"sunglasses blinking","frames":"4","facing":"-1","tags":"sunglasses, sun, eye protection, fashion, polarized, lenses, frames, Ray-Ban, eyeglasses","notes":""},"299":{"mid":"299","parent":"298","name":"First Aid","slug":"299-first-aid","tier1":"Medical Health","tier2":"Diseases and Conditions","tier3":"Injuries","tier4":"First Aid","creator":"Lauren Crane","object":"bloody bandaid with hair","frames":"","facing":"-1","tags":"health, medicine, bandaid, injury, first aid, bandaids, injuries, scraped, adhesive, bandage, bandages, adhesives","notes":""},"324":{"mid":"324","parent":"","name":"Movies","slug":"324-movies","tier1":"Movies","tier2":"","tier3":"","tier4":"","creator":"Lauren Crane","object":"movie director clap board with brain","frames":"3","facing":"1","tags":"movie, movies, movie theater, movie theatre, cinema, action movie, adventure movie, science fiction movie, animated movie, comedy movie, documentary, drama, dramas, soap opera, children movie, horror movie, film, director, clapboard, clapperboard","notes":""},"338":{"mid":"338","parent":"","name":"Music and Audio","slug":"338-music-and-audio","tier1":"Music and Audio","tier2":"","tier3":"","tier4":"","creator":"Katie Im","object":"headphones","frames":"","facing":"0","tags":"music, audio, headphones, alternative, classical, country, comedy, podcast, song, songs, jazz, blues, rap","notes":""},"343":{"mid":"343","parent":"338","name":"Alternative Music","slug":"343-alternative-music","tier1":"Music and Audio","tier2":"Alternative Music","tier3":"","tier4":"","creator":"Rebecca Strawn","object":"343 record player","frames":"5","facing":"1","tags":"record,recordplayer,alternative,music","notes":""},"348":{"mid":"348","parent":"338","name":"Comedy (Music and Audio)","slug":"348-comedy-music-and-audio","tier1":"Music and Audio","tier2":"Comedy (Music and Audio)","tier3":"","tier4":"","creator":"Rebecca Strawn","object":"headphones","frames":"","facing":"0","tags":"music, audio, headphones, comedy, podcast","notes":""},"355":{"mid":"355","parent":"338","name":"Hip Hop Music","slug":"355-hip-hop-music","tier1":"Music and Audio","tier2":"Hip Hop Music","tier3":"","tier4":"","creator":"Chloe Pitkoff","object":"boombox","frames":"","facing":"0","tags":"radio,boombox,music,hiphop, radios, boomboxes, electronics","notes":""},"362":{"mid":"362","parent":"338","name":"R&B/Soul/Funk","slug":"362-rb-soul-funk","tier1":"Music and Audio","tier2":"R&B/Soul/Funk","tier3":"","tier4":"","creator":"Rebecca Strawn","object":"sax","frames":"","facing":"1","tags":"sax,saxophone,music","notes":""},"405":{"mid":"405","parent":"391","name":"Personal Debt","slug":"405-personal-debt","tier1":"Personal Finance","tier2":"Personal Debt","tier3":"","tier4":"","creator":"Allyson Taylor","object":"crying dollar bill","frames":"","facing":"1","tags":"money, finance, debt, bill, dollar","notes":""},"410":{"mid":"410","parent":"391","name":"Personal Investing","slug":"410-personal-investing","tier1":"Personal Finance","tier2":"Personal Investing","tier3":"","tier4":"","creator":"Mike Bauman","object":"410-piggy-bank","frames":"","facing":"1","tags":"money, saving, investment, personal investing, personal finance, finance, finances, personal finances, investments","notes":""},"420":{"mid":"420","parent":"417","name":"Phone Services","slug":"420-phone-services","tier1":"Personal Finance","tier2":"Home Utilities","tier3":"Phone Services","tier4":"","creator":"Chloe Pitkoff","object":"420-rotary-phone","frames":"4","facing":"0","tags":"android, iphone, smartphone, phone, phones, phone services, rotary phone, landline, telephone, telephones, old phone, telecommunications, communication","notes":""},"425":{"mid":"425","parent":"422","name":"Dogs","slug":"425-dogs","tier1":"Pets","tier2":"Dogs","tier3":"","tier4":"","creator":"Mike Bauman","object":"425-doghouse","frames":"","facing":"-1","tags":"dog, pet, doghouse, canine, woof, pet care, puppy, collar, collars, dogs, pets","notes":""},"443":{"mid":"443","parent":"441","name":"Retail Property","slug":"443-retail-property","tier1":"Real Estate","tier2":"Retail Property","tier3":"","tier4":"","creator":"Chloe Pitkoff","object":"443 keys (bit of a stretch but no where else to put it —Joelle)","frames":"","facing":"0","tags":"key,retail,property,rental","notes":"needs sprite sheet and gif"},"477":{"mid":"477","parent":"473","name":"Grocery Shopping","slug":"477-grocery-shopping","tier1":"Shopping","tier2":"Grocery Shopping","tier3":"","tier4":"","creator":"Adelle Patten","object":"shopping cart","frames":"","facing":"1","tags":"shopping, cart, buggy, groceries, retail, check out, shop, buy, buying","notes":""},"478":{"mid":"478","parent":"473","name":"Holiday Shopping","slug":"478-holiday-shopping","tier1":"Shopping","tier2":"Holiday Shopping","tier3":"","tier4":"","creator":"Chloe Pitkoff","object":"wrapping tape","frames":"6","facing":"1","tags":"shopping,shop,holiday,wrap,wrapping,paper","notes":"needs sprite sheet and gif, not on 'originals'"},"479":{"mid":"479","parent":"473","name":"Household Supplies","slug":"479-household-supplies","tier1":"Shopping","tier2":"Household Supplies","tier3":"","tier4":"","creator":"Chloe Pitkoff","object":"dustpan ","frames":"","facing":"0","tags":"shopping, cleaning, home, house, supplies","notes":""},"482":{"mid":"482","parent":"473","name":"Children's Games and Toys","slug":"482-childrens-games-and-toys","tier1":"Shopping","tier2":"Children's Games and Toys","tier3":"","tier4":"","creator":"Joelle Dietrick","object":"fidget spinner","frames":"","facing":"0","tags":"toy, fidget, spinner, fidget spinner, spin, toys, fidgets, ","notes":"needs gif"},"492":{"mid":"492","parent":"483","name":"Cycling","slug":"492-cycling","tier1":"Sports","tier2":"Cycling","tier3":"","tier4":"","creator":"Owen Mundy","object":"bike with eyes and streamers","frames":"","facing":"-1","tags":"streamers,bike,bicycle,cycling,mtb,biking, bikes, bicycles, cycle","notes":""},"516":{"mid":"516","parent":"483","name":"Inline Skating","slug":"516-inline-skating","tier1":"Sports","tier2":"Inline Skating","tier3":"","tier4":"","creator":"Joelle Dietrick","object":"516 hoverboard (bit of a stretch but no other home —Joelle)","frames":"","facing":"-1","tags":"hoverboard, inline, skate","notes":""},"563":{"mid":"563","parent":"561","name":"Women's Handbags and Wallets","slug":"563-womens-handbags-and-wallets","tier1":"Style & Fashion","tier2":"Women's Fashion","tier3":"Women's Accessories","tier4":"Women's Handbags and Wallets","creator":"Joelle Dietrick","object":"563-purse","frames":"","facing":"0","tags":"purse, accessories, handbag, bag, fashion, women's fashion","notes":""},"589":{"mid":"589","parent":"579","name":"Men's Shoes and Footwear","slug":"589-mens-shoes-and-footwear","tier1":"Style & Fashion","tier2":"Men's Fashion","tier3":"Men's Shoes and Footwear","tier4":"","creator":"Mike Bauman","object":"pink vans shoe","frames":"","facing":"-1","tags":"fashion, shoe, laces, shoes, mens, canvas, slip-on, vans","notes":""},"594":{"mid":"594","parent":"590","name":"Shaving","slug":"594-shaving","tier1":"Style & Fashion","tier2":"Personal Care","tier3":"Shaving","tier4":"","creator":"Owen Mundy","object":"straight razor with eyebrows, blood","frames":"","facing":"0","tags":"razor, razors, shave, shaving, blade, blades","notes":"needs sprite sheet, not on 'originals'"},"599":{"mid":"599","parent":"596","name":"Computing","slug":"599-computing","tier1":"Technology & Computing","tier2":"Computing","tier3":"","tier4":"","creator":"Allyson Taylor","object":"laptop","frames":"","facing":"1","tags":"laptop, computer, computing, typing, computers, laptops","notes":""},"618":{"mid":"618","parent":"599","name":"Information and Network Security","slug":"618-information-and-network-security","tier1":"Technology & Computing","tier2":"Computing","tier3":"Information and Network Security","tier4":"","creator":"Joelle Dietrick","object":"618 apps button","frames":"5","facing":"0","tags":"info,data,security,app,button","notes":""},"632":{"mid":"632","parent":"596","name":"Consumer Electronics","slug":"632-consumer-electronics","tier1":"Technology & Computing","tier2":"Consumer Electronics","tier3":"","tier4":"","creator":"Chloe Pitkoff","object":"mouse","frames":"","facing":"1","tags":"mouse, electronics, computer, peripheral ","notes":""},"633":{"mid":"633","parent":"632","name":"Cameras and Camcorders","slug":"633-cameras-and-camcorders","tier1":"Technology & Computing","tier2":"Consumer Electronics","tier3":"Cameras and Camcorders","tier4":"","creator":"Chloe Pitkoff","object":"camera","frames":"6","facing":"-1","tags":"tech,technology,camera,camcorder,electronics","notes":""},"637":{"mid":"637","parent":"632","name":"Wearable Technology","slug":"637-wearable-technology","tier1":"Technology & Computing","tier2":"Consumer Electronics","tier3":"Wearable Technology","tier4":"","creator":"Joelle Dietrick","object":"health fitness watch","frames":"","facing":"1","tags":"health, sport, data, fit, watch, fashion, accessory","notes":""},"639":{"mid":"639","parent":"596","name":"Virtual Reality","slug":"639-virtual-reality","tier1":"Technology & Computing","tier2":"Virtual Reality","tier3":"","tier4":"","creator":"Joelle Dietrick","object":"","frames":"","facing":"-1","tags":"vr,ar,virtual,augmented,3d","notes":""},"640":{"mid":"640","parent":"","name":"Television","slug":"640-television","tier1":"Television","tier2":"","tier3":"","tier4":"","creator":"Mike Bauman","object":"tv turning off","frames":"4","facing":"1","tags":"tv, televeision, tvs, televisions, episode, channel","notes":""},"652":{"mid":"652","parent":"640","name":"Science Fiction TV","slug":"652-science-fiction-tv","tier1":"Television","tier2":"Science Fiction TV","tier3":"","tier4":"","creator":"Joelle Dietrick","object":"lady ashtray","frames":"","facing":"-1","tags":"science fiction, alien, twilight zone","notes":""},"653":{"mid":"653","parent":"","name":"Travel","slug":"653-travel","tier1":"Travel","tier2":"","tier3":"","tier4":"","creator":"Mike Bauman","object":"suitcase with eyes","frames":"","facing":"0","tags":"suitcase, travel, luggage, flight, bag, baggage","notes":""},"655":{"mid":"655","parent":"653","name":"Travel Locations","slug":"655-travel-locations","tier1":"Travel","tier2":"Travel Locations","tier3":"","tier4":"","creator":"John Crawford","object":"655 plane","frames":"","facing":"1","tags":"plane,travel,location","notes":""},"681":{"mid":"681","parent":"680","name":"Console Games","slug":"681-console-games","tier1":"Video Gaming","tier2":"Console Games","tier3":"","tier4":"","creator":"Joelle Dietrick","object":"nintendo switch controller","frames":"","facing":"0","tags":"gaming, nintendo, switch, video, game, controller, console game, video game","notes":""}}
;

     return {
         dataById:dataById,
        // slugsById:slugsById,
         idsByTag:idsByTag
     }

})();
