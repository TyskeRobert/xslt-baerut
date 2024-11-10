<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="3.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:tei="http://www.tei-c.org/ns/1.0">
    <xsl:output encoding="UTF-8" method="json" indent="yes"/>
    <xsl:strip-space elements="*"/>
    <xsl:template match="corpus">
        <xsl:map>
            <xsl:map-entry key="'date'" select="current-dateTime()"/>
            <xsl:map-entry key="'sources'" select="array{for $s in source return string($s/@id)}"/>
        </xsl:map>
    </xsl:template>
</xsl:stylesheet>