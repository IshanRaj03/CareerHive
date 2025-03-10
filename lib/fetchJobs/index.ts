const linkedIn = require("linkedin-jobs-api");

type LinkedInJob = {
  position: string;
  company: string;
  companyLogo: string;
  location: string;
  date: string;
  agoTime: string;
  salary: string;
  jobUrl: string;
};

type LinkedInResponse = LinkedInJob[];

export async function fetchjobswithlocation({
  keyword,
  experienceLevel,
  location,
}: {
  keyword: string;
  experienceLevel: string;
  location: string;
}) {
  const queryOptionsWithLocation = {
    keyword,
    dateSincePosted: "past Week",
    experienceLevel,
    location,
    limit: 35,
  };

  try {
    const responsewithLocation = await linkedIn.query(queryOptionsWithLocation);

    const typedResponse = responsewithLocation as LinkedInResponse;
    return typedResponse;
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }
}

export async function fetchjobswithoutlocation({
  keyword,
  experienceLevel,
}: {
  keyword: string;
  experienceLevel: string;
}) {
  const queryOptionsWithoutLocation = {
    keyword,
    dateSincePosted: "past Week",
    experienceLevel,
    limit: 15,
  };

  try {
    const responsewithLocation = await linkedIn.query(
      queryOptionsWithoutLocation
    );

    const typedResponse = responsewithLocation as LinkedInResponse;
    return typedResponse;
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }
}
