import Image from "next/image";
import { getPayload } from "payload";
import { Grid, GridItem } from "@/components/layout/grid";
import config from "@/payload.config";

export async function AboutPage() {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });
  const aboutGlobal = await payload.findGlobal({
    slug: "about",
  });

  const experiences = aboutGlobal.experiences;
  const education = aboutGlobal.education;
  const hardSkillsCategories = aboutGlobal.hardSkillsCategories;
  const softSkills = aboutGlobal.softSkills;
  const languages = aboutGlobal.languages;
  console.log(experiences);
  return (
    <>
      <Grid className="min-h-screen">
        <GridItem
          span={"full"}
          className="h-full flex flex-col justify-center md:col-start-2! md:col-end-6!"
        >
          <Image
            className="flex h-auto aspect-5/6 w-full object-cover"
            src={
              typeof aboutGlobal.image === "number"
                ? ""
                : (aboutGlobal.image.url ?? "")
            }
            alt={
              typeof aboutGlobal.image === "number" ? "" : aboutGlobal.image.alt
            }
            width={1920}
            height={1080}
          />
        </GridItem>
        <GridItem
          span={"full"}
          className="h-full flex flex-col gap-16 justify-start md:col-start-6! md:col-end-12! md:justify-center"
        >
          <h1 className="font-aston-script text-5xl md:text-6xl lg:text-7xl text-white whitespace-nowrap">
            {aboutGlobal.name}
          </h1>
          {aboutGlobal.description && (
            <div className="flex flex-col gap-1">
              <h2 className="text-white text-[16px] font-bold uppercase">
                Who ?
              </h2>
              <p className="text-white text-[16px] font-normal">
                {aboutGlobal.description}
              </p>
            </div>
          )}
        </GridItem>
      </Grid>
      {(experiences && experiences.length !== 0) ||
      (education && education.length !== 0) ||
      (hardSkillsCategories && hardSkillsCategories.length !== 0) ||
      (softSkills && softSkills.length !== 0) ||
      (languages && languages.length !== 0) ? (
        <Grid className="min-h-screen gap-y-28! mt-28 md:mt-0 mb-10">
          {experiences && experiences.length !== 0 && (
            <GridItem
              start={2}
              end={12}
              span={"full"}
              className="h-full flex flex-col gap-3"
            >
              <h2 className="text-white text-[16px] font-bold uppercase">
                Experiences
              </h2>
              <div className="flex flex-col gap-2">
                {experiences.map((experience, idx) => {
                  return (
                    <Grid columns={10} withMargins={false} key={`exp-${idx}`}>
                      <GridItem span={2} className="md:col-span-1!">
                        <p className="text-white text-[16px] font-normal w-full">{`${experience.startYear} / ${experience.endYear || "now"}`}</p>
                      </GridItem>
                      <GridItem span={2} className="md:col-span-1!">
                        <p className="text-white text-[16px] font-normal w-full">
                          {experience.enterpriseName}
                        </p>
                      </GridItem>
                      <GridItem span={4} className="md:col-span-2!">
                        <p className="text-white text-[16px] font-normal w-full">
                          {experience.jobPost}
                        </p>
                      </GridItem>
                      <GridItem span={2} className="md:col-span-1!">
                        <p className="text-white text-[16px] font-normal w-full">
                          {experience.jobType}
                        </p>
                      </GridItem>
                    </Grid>
                  );
                })}
              </div>
            </GridItem>
          )}
          {education && education.length !== 0 && (
            <GridItem
              start={2}
              end={12}
              span={"full"}
              className="md:col-start-7! h-full flex flex-col gap-3"
            >
              <h2 className="text-white text-[16px] font-bold uppercase">
                Education
              </h2>
              <div className="flex flex-col gap-2">
                {education
                  .sort((a, b) => {
                    if (a.endYear === null || a.endYear === undefined) return 1;
                    if (b.endYear === null || b.endYear === undefined)
                      return -1;
                    return b.endYear - a.endYear;
                  })
                  .map((eduInfo, idx) => {
                    return (
                      <Grid
                        columns={10}
                        withMargins={false}
                        key={`edu-${idx}`}
                        className="md:grid-cols-5!"
                      >
                        <GridItem span={2}>
                          <p className="text-white text-[16px] font-normal w-full">{`${eduInfo.startYear} / ${eduInfo.endYear || "now"}`}</p>
                        </GridItem>
                        <GridItem span={4} className="md:col-span-2!">
                          <p className="text-white text-[16px] font-normal w-full text-left">
                            {eduInfo.schoolType}
                          </p>
                        </GridItem>
                        <GridItem span={2} className="md:col-span-1!">
                          <p className="text-white text-[16px] font-normal w-full text-right">
                            {eduInfo.schoolName}
                          </p>
                        </GridItem>
                      </Grid>
                    );
                  })}
              </div>
            </GridItem>
          )}
          {hardSkillsCategories && hardSkillsCategories.length !== 0 && (
            <GridItem
              start={2}
              end={12}
              span={"full"}
              className="h-full flex flex-col gap-3"
            >
              <h2 className="text-white text-[16px] font-bold uppercase">
                Hard skills
              </h2>
              <div className="flex flex-col gap-2">
                {hardSkillsCategories.map((category, idx) => {
                  return (
                    <Grid columns={10} withMargins={false} key={`cat-${idx}`}>
                      <GridItem span={2}>
                        <p className="text-white text-[16px] font-medium w-full">
                          {category.categoryName}
                        </p>
                      </GridItem>
                      <GridItem start={3} end={12}>
                        <p className="text-white text-[16px] font-normal w-full">
                          {category.hardSkills
                            ?.map((skill) => skill.name)
                            .join(", ")}
                        </p>
                      </GridItem>
                    </Grid>
                  );
                })}
              </div>
            </GridItem>
          )}
          {softSkills && softSkills.length !== 0 && (
            <GridItem
              start={2}
              end={12}
              span={"full"}
              className="md:col-start-7! h-full flex flex-col gap-3"
            >
              <h2 className="text-white text-[16px] font-bold uppercase">
                Soft skills
              </h2>
              <div className="flex flex-col gap-2">
                {softSkills.map((skill, idx) => {
                  return (
                    <Grid columns={10} withMargins={false} key={`soft-${idx}`}>
                      <GridItem span={5}>
                        <p className="text-white text-[16px] font-normal w-full">
                          {skill.name}
                        </p>
                      </GridItem>
                      <GridItem start={6} end={10}>
                        <p className="text-white text-[16px] font-normal w-full text-center">
                          {skill.description}
                        </p>
                      </GridItem>
                    </Grid>
                  );
                })}
              </div>
            </GridItem>
          )}
          {languages && languages.length !== 0 && (
            <GridItem
              start={2}
              end={12}
              span={"full"}
              className="h-full flex flex-col gap-3"
            >
              <h2 className="text-white text-[16px] font-bold uppercase">
                Languages
              </h2>
              <div className="flex flex-col gap-2">
                {languages.map((lang, idx) => {
                  return (
                    <Grid columns={10} withMargins={false} key={`lang-${idx}`}>
                      <GridItem span={2} className="md:col-span-1!">
                        <p className="text-white text-[16px] font-normal w-full">
                          {lang.name}
                        </p>
                      </GridItem>
                      <GridItem start={3} end={10} className="md:col-start-2!">
                        <p className="text-white text-[16px] font-normal w-full">
                          {lang.level}
                        </p>
                      </GridItem>
                    </Grid>
                  );
                })}
              </div>
            </GridItem>
          )}
        </Grid>
      ) : null}
    </>
  );
}
