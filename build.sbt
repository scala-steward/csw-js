import ohnosequences.sbt.GithubRelease.keys.ghreleaseAssets
import ohnosequences.sbt.SbtGithubReleasePlugin
import org.tmt.sbt.docs.DocKeys._

lazy val aggregatedProjects: Seq[ProjectReference] = Seq(
  `integration`,
  `docs`
)

/* ================= Root Project ============== */
lazy val `csw-js` = project
  .in(file("."))
  .enablePlugins(SbtGithubReleasePlugin)
  .settings(
    ghreleaseRepoOrg := "tmtsoftware",
    ghreleaseRepoName := "csw-js",
    ghreleaseAssets := Seq()
  )
  .aggregate(aggregatedProjects: _*)

/* ================= Paradox Docs ============== */
lazy val docs = project
  .enablePlugins(DocsPlugin)
  .disablePlugins(SbtGithubReleasePlugin)
  .settings(
    docsRepo := "git@github.com:tmtsoftware/tmtsoftware.github.io.git",
    docsParentDir := "csw-js",
    gitCurrentRepo := "https://github.com/tmtsoftware/csw-js"
  )

lazy val `integration` = project
  .in(file("integration"))
  .settings(
    libraryDependencies ++= Dependencies.Integration.value
  )
  .disablePlugins(SbtGithubReleasePlugin)
