CREATE TABLE stars (
id serial PRIMARY KEY,
heading varchar (255) not null,
url varchar (255) not null,
description text not null,
featured bool
);

insert into stars (heading, url, description, featured)
Values
('Crab Nebula', 'https://stsci-opo.org/STScI-01HBBMDW8B4A90QZ64RGQJHRV1.png', 'NASA''s James Webb Space Telescope has gazed at the Crab Nebula in the search for answers about the supernova remnant’s origins. Webb’s NIRCam (Near-Infrared Camera) and MIRI (Mid-Infrared Instrument) have revealed new details in infrared light.', false),
('HH 211','https://stsci-opo.org/STScI-01H9NWHWKBM3DM6PQQPZDSVY7Y.png', 'Molecules excited by the turbulent conditions, including molecular hydrogen, carbon monoxide and silicon monoxide, emit infrared light, collected by Webb, that map out the structure of the outflows.', false ),
('NGC 346', 'https://stsci-opo.org/STScI-01HBVHYACKXBP5Y9R50MAEQYKR.png','Bright patches and filaments mark areas with abundant numbers of protostars. This image includes 7.7-micron light shown in blue, 10 microns in cyan, 11.3 microns in green, 15 microns in yellow, and 21 microns in red.', false ),
('Ring Nebula', 'https://stsci-opo.org/STScI-01H82G1P61JMNCENZ6S3D6AGHQ.png','There are some 20,000 dense globules in the nebula, which are rich in molecular hydrogen. In contrast, the inner region shows very hot gas. The main shell contains a thin ring of enhanced emission from carbon-based molecules.', false ),
('Pillars of Creation', 'https://stsci-opo.org/STScI-01GFRYX6CJ1ZTKW4PHAE55BY8P.png','Many stars are actively forming in these dense blue-gray pillars. When knots of gas and dust with sufficient mass form in these regions, they begin to collapse under their own gravitational attraction, slowly heat up – and eventually form new stars.', true );
